import { writable } from 'svelte/store';
import { db, auth } from '../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import authStore from '../../stores/authStore';

// Initialize moods store
export const moods = writable([]);

let unsubscribe = null;

// Subscribe to authStore to dynamically synchronize Firestore query
authStore.subscribe(state => {
  // Always clean up the previous listener when auth state change occurs
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  if (state.isLoggedIn && state.user) {
    const q = query(
      collection(db, 'moods'),
      where('userId', '==', state.user.uid)
    );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...docSnap.data()
          });
        });
        // Sort client-side by timestamp descending to avoid requiring composite indexes in Firestore
        items.sort((a, b) => {
          const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : (a.timestamp ? new Date(a.timestamp).getTime() : Date.now());
          const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : (b.timestamp ? new Date(b.timestamp).getTime() : Date.now());
          return timeB - timeA;
        });
        moods.set(items);
      },
      (err) => {
        console.error('Firestore query listener error:', err);
      }
    );
  } else {
    // If not logged in, clear moods list
    moods.set([]);
  }
});

// ✅ Add mood function
export async function addMood(moodValue, noteText) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be logged in to add a mood');
  }

  await addDoc(collection(db, 'moods'), {
    userId: currentUser.uid,
    userEmail: currentUser.email,
    mood: moodValue,
    note: noteText ? noteText.trim() : '',
    timestamp: serverTimestamp()
  });
}

// ✅ Delete mood function
export async function deleteMood(id) {
  await deleteDoc(doc(db, 'moods', id));
}

// ✅ Helper function to get mood configuration
export function getMoodConfig(moodValue) {
  const moodOptions = [
    { value: 'amazing', emoji: '😄', label: 'Amazing', color: '#48bb78' },
    { value: 'happy', emoji: '😊', label: 'Happy', color: '#38b2ac' },
    { value: 'okay', emoji: '😐', label: 'Okay', color: '#ecc94b' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: '#ed8936' },
    { value: 'terrible', emoji: '😭', label: 'Terrible', color: '#f56565' }
  ];

  return moodOptions.find(m => m.value === moodValue) || moodOptions[2]; // Default to 'okay'
}

// ✅ Format timestamp nicely (robust against Firestore's ServerTimestamp null states)
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'Just now';

  let date;
  if (typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  // Calculate time difference
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return appropriate format
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  // For older entries, show full date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

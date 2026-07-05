import { writable } from 'svelte/store';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Create a writable store with initial state
const authStore = writable({
  user: null,
  loading: true,
  isLoggedIn: false
});

// Helper actions
export function setUser(user) {
  authStore.set({
    user,
    loading: false,
    isLoggedIn: !!user
  });
}

export function clearUser() {
  authStore.set({
    user: null,
    loading: false,
    isLoggedIn: false
  });
}

export async function logout() {
  await signOut(auth);
}

import { browser } from '$app/env';

// Listen to Firebase authentication state changes
if (browser && auth) {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      authStore.set({
        user: firebaseUser,
        loading: false,
        isLoggedIn: true
      });
    } else {
      authStore.set({
        user: null,
        loading: false,
        isLoggedIn: false
      });
    }
  });
}

// Expose public API
export default {
  subscribe: authStore.subscribe,
  setUser,
  clearUser
};

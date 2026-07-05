<script>
  // ============================================
  // MOOD TRACKER DASHBOARD - Completed Version
  // ============================================

  // ==================== IMPORTS ====================
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { moods, addMood, deleteMood, getMoodConfig, formatTimestamp } from '$lib/stores/moodStore';
  import authStore, { logout } from '../stores/authStore';

  // ==================== STATE VARIABLES ====================
  // Mood form data
  let mood = '';        // Which mood did user select?
  let note = '';        // Optional note about their mood

  // App state
  let submitting = false; // True while saving new mood
  let error = '';         // Error messages

  // Mood options with emojis and colors!
  const moodOptions = [
    { value: 'amazing', emoji: '😄', label: 'Amazing', color: '#48bb78' },
    { value: 'happy', emoji: '😊', label: 'Happy', color: '#38b2ac' },
    { value: 'okay', emoji: '😐', label: 'Okay', color: '#ecc94b' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: '#ed8936' },
    { value: 'terrible', emoji: '😭', label: 'Terrible', color: '#f56565' }
  ];

  // Add mood handler
  async function handleAddMood() {
    if (!mood) {
      error = 'Please select a mood';
      return;
    }

    submitting = true;
    error = '';

    try {
      await addMood(mood, note);
      console.log('Mood saved successfully!');

      // Clear the form
      mood = '';
      note = '';
    } catch (err) {
      console.error('Error adding mood:', err);
      error = 'Failed to add mood. Please try again.';
    } finally {
      submitting = false;
    }
  }

  // Delete mood handler
  async function handleDeleteMood(id) {
    if (confirm('Are you sure you want to delete this mood?')) {
      try {
        await deleteMood(id);
      } catch (err) {
        console.error('Error deleting mood:', err);
        alert('Failed to delete mood. Please try again.');
      }
    }
  }

  // Protecting dashboard route
  $: if (browser && !$authStore.loading && !$authStore.isLoggedIn) {
    goto('/login');
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap");

  :global(body) {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    min-height: 100vh;
    padding: 2rem 0;
    font-family: 'Outfit', sans-serif;
  }

  .loading-container {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
  }

  .loading-text {
    color: white;
    font-size: 1.125rem;
    font-weight: 500;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .dashboard-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .header h1 {
    font-weight: 800;
    color: #1e1b4b;
  }

  .live-badge {
    display: inline-block;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }

  .mood-form {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  }

  .mood-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .mood-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background: white;
  }

  .mood-option:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
  }

  .mood-option.selected {
    border-color: #4f46e5;
    background: #f5f3ff;
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(79, 70, 229, 0.15);
  }

  .mood-emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    transition: transform 0.2s;
  }

  .mood-option:hover .mood-emoji {
    transform: scale(1.1);
  }

  .mood-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #4a5568;
  }

  .mood-card {
    background: white;
    border-radius: 16px;
    padding: 1.75rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    margin-bottom: 1rem;
    transition: all 0.2s ease-in-out;
  }

  .mood-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }

  .mood-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mood-display {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mood-card-emoji {
    font-size: 2.25rem;
  }

  .mood-card-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
  }

  .mood-timestamp {
    font-size: 0.875rem;
    color: #718096;
  }

  .mood-note {
    color: #4a5568;
    margin-top: 0.5rem;
    margin-bottom: 0;
    line-height: 1.6;
    background: #f8fafc;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border-left: 4px solid #cbd5e1;
  }

  .btn-delete {
    padding: 0.375rem 0.75rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-delete:hover {
    background: #dc2626;
  }

  .btn-logout {
    font-weight: 600;
    border-radius: 10px;
    padding: 0.375rem 0.85rem;
  }

  .error-message {
    background: #fee2e2;
    border: 1px solid #fca5a5;
    color: #b91c1c;
    padding: 0.75rem;
    border-radius: 10px;
    margin-bottom: 1.25rem;
    font-weight: 500;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(255,255,255,0.12);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .empty-state-emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state-text {
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .empty-state-subtext {
    color: rgba(255,255,255,0.85);
  }
</style>

<div class="dashboard-container">
  {#if $authStore.loading || !$authStore.isLoggedIn}
    <div class="loading-container">
      <div class="spinner"></div>
      <div class="loading-text">Securing your session...</div>
    </div>
  {:else}
    <!-- Header -->
    <div class="header">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="live-badge">
            ⚡ Firebase Firestore Connected
          </div>
          <h1>🌈 Mood Tracker</h1>
          <p class="text-muted mb-0">Track your emotions and reflect on your day in real-time</p>
        </div>
      </div>
      <hr />
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-muted small">
          Logged in as: <strong>{$authStore.user.email}</strong>
        </div>
        <button class="btn btn-outline-danger btn-logout btn-sm" on:click={logout}>
          Logout
        </button>
      </div>
    </div>

    <!-- Mood Input Form -->
    <div class="mood-form">
      <h5 class="mb-4 font-weight-bold" style="color: #1e1b4b;">How are you feeling today?</h5>

      <!-- Error Message -->
      {#if error}
        <div class="error-message">⚠️ {error}</div>
      {/if}

      <!-- Mood Options -->
      <div class="mood-options">
        {#each moodOptions as option}
          <button
            class="mood-option"
            class:selected={mood === option.value}
            on:click={() => { mood = option.value; error = ''; }}
            type="button"
          >
            <span class="mood-emoji">{option.emoji}</span>
            <span class="mood-label">{option.label}</span>
          </button>
        {/each}
      </div>

      <!-- Note Input -->
      <div class="mb-4">
        <label for="noteInput" class="form-label font-weight-bold text-muted small">ADD A NOTE (OPTIONAL)</label>
        <textarea
          id="noteInput"
          class="form-control"
          rows="3"
          placeholder="What's on your mind? Capture the moments..."
          bind:value={note}
          disabled={submitting}
          style="border-radius: 12px; border: 2px solid #e2e8f0;"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <button
        class="btn btn-primary btn-block py-2 font-weight-bold"
        on:click={handleAddMood}
        disabled={!mood || submitting}
        style="border-radius: 12px; background: linear-gradient(to right, #4f46e5, #7c3aed); border: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);"
      >
        {submitting ? 'Adding entry...' : 'Add Mood Entry'}
      </button>
    </div>

    <!-- Mood History List -->
    <div class="mood-history">
      <h5 class="mb-3 font-weight-bold text-white">Your Mood History</h5>
      {#if $moods.length === 0}
        <div class="empty-state">
          <div class="empty-state-emoji">🎈</div>
          <div class="empty-state-text">No mood entries yet</div>
          <div class="empty-state-subtext">Select a mood above and add your first entry!</div>
        </div>
      {:else}
        {#each $moods as item (item.id)}
          <div class="mood-card">
            <div class="mood-card-header">
              <div class="mood-display">
                <span class="mood-card-emoji">{getMoodConfig(item.mood).emoji}</span>
                <div>
                  <span class="mood-card-label" style="color: {getMoodConfig(item.mood).color}">{getMoodConfig(item.mood).label}</span>
                  <div class="mood-timestamp">{formatTimestamp(item.timestamp)}</div>
                </div>
              </div>
              <button class="btn-delete" on:click={() => handleDeleteMood(item.id)}>
                Delete
              </button>
            </div>
            {#if item.note}
              <p class="mood-note">{item.note}</p>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
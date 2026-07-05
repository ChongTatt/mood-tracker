<script>
  // ============================================
  // SIGNUP PAGE - Completed Version
  // ============================================

  // ==================== IMPORTS ====================
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../firebase';
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import authStore from '../stores/authStore';

  // ==================== STATE VARIABLES ====================
  let email = '';              // User's email
  let password = '';           // User's password
  let confirmPassword = '';    // Confirm password input
  let error = '';              // Error messages
  let loading = false;         // Loading state

  // ==================== VALIDATION FUNCTIONS ====================
  function isValidEmail(emailVal) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailVal);
  }

  function validateForm() {
    if (!email.trim() || !password || !confirmPassword) {
      return 'Please fill in all fields';
    }

    if (!isValidEmail(email)) {
      return 'Please enter a valid email address';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null; // Everything is valid!
  }

  // ==================== SIGNUP FUNCTION ====================
  async function register() {
    error = '';

    // Validate form and check for errors
    const validationError = validateForm();
    if (validationError) {
      error = validationError;
      return;
    }

    loading = true;

    try {
      // Create user with Firebase
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log('Account created successfully!');

      // Navigate to homepage
      await goto('/');
    } catch (err) {
      console.error('Signup error:', err);

      // Handle different Firebase errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          error = 'This email is already registered. Please login instead.';
          break;
        case 'auth/invalid-email':
          error = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          error = 'Password is too weak. Please use a stronger password.';
          break;
        default:
          error = err.message || 'Failed to create account. Please try again.';
      }
    } finally {
      loading = false;
    }
  }

  // ==================== REACTIVE CHECKS ====================
  // Redirect if already logged in
  $: if (browser && $authStore.isLoggedIn && !loading) {
    goto('/');
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap");

  .auth-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c084fc 100%);
    padding: 2rem 1rem;
    font-family: 'Outfit', sans-serif;
  }

  .auth-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 3rem 2.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: 440px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease;
  }

  .auth-card:hover {
    transform: translateY(-4px);
  }

  .brand-title {
    font-weight: 800;
    font-size: 2.25rem;
    background: linear-gradient(to right, #4f46e5, #9333ea);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  .brand-subtitle {
    color: #6b7280;
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 2rem;
  }

  .form-group label {
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .form-control {
    border-radius: 12px;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }

  .form-control:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    outline: none;
  }

  .btn-submit {
    background: linear-gradient(to right, #4f46e5, #7c3aed);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.85rem;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .btn-submit:hover:not(:disabled) {
    background: linear-gradient(to right, #4338ca, #6d28d9);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fee2e2;
    color: #dc2626;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  .login-link {
    color: white;
    font-size: 0.95rem;
    text-decoration: none;
    transition: opacity 0.2s;
    font-weight: 500;
  }

  .login-link:hover {
    opacity: 0.9;
    text-decoration: none;
  }

  .login-link strong {
    font-weight: 600;
    border-bottom: 2px solid white;
  }
</style>

<div class="auth-container">
  <div class="auth-card text-center">
    <h1 class="brand-title">Create Account</h1>
    <p class="brand-subtitle">Sign up to start tracking your daily mood</p>

    <!-- Error Message -->
    {#if error}
      <div class="error-message">
        <span>⚠️</span> {error}
      </div>
    {/if}

    <!-- Signup Form -->
    <form on:submit|preventDefault={register}>
      <!-- Email Input -->
      <div class="form-group text-left mb-3">
        <label for="emailInput">Email Address</label>
        <input
          bind:value={email}
          type="email"
          class="form-control"
          id="emailInput"
          placeholder="your@email.com"
          disabled={loading}
          required
        />
      </div>

      <!-- Password Input -->
      <div class="form-group text-left mb-3">
        <label for="passwordInput">Password</label>
        <input
          bind:value={password}
          type="password"
          class="form-control"
          id="passwordInput"
          placeholder="At least 6 characters"
          disabled={loading}
          required
        />
      </div>

      <!-- Confirm Password Input -->
      <div class="form-group text-left mb-3">
        <label for="confirmPasswordInput">Confirm Password</label>
        <input
          bind:value={confirmPassword}
          type="password"
          class="form-control"
          id="confirmPasswordInput"
          placeholder="Repeat password"
          disabled={loading}
          required
        />
      </div>

      <div class="form-text text-muted mb-4 small text-left">
        Your password must be at least 6 characters long.
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn btn-submit btn-block mt-4"
        disabled={loading}
      >
        {#if loading}
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Creating account...
        {:else}
          Sign Up
        {/if}
      </button>
    </form>
  </div>

  <div class="text-center mt-4">
    <a href="/login" class="login-link">
      Already have an account? <strong>Login here</strong>
    </a>
  </div>
</div>

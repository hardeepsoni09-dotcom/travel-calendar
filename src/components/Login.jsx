import { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import '../styles/Login.css';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Try signing in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found. Please sign up.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon">✈️</div>
            <h1>Au-India-Travel</h1>
            <p>Connect with travelers between Australia and India</p>
          </div>

          <form onSubmit={handleAuth} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="your@email.com"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <span className="loading-spinner">Loading...</span>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <div className="auth-toggle">
            <p>
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="toggle-button"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>

        <div className="login-info">
          <div className="info-card">
            <div className="info-icon">🌍</div>
            <h3>Global Community</h3>
            <p>Connect with travelers from around the world</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📅</div>
            <h3>Easy Planning</h3>
            <p>View travel dates and find fellow travelers</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🤝</div>
            <h3>Stay Connected</h3>
            <p>Build relationships with your travel community</p>
          </div>
        </div>
      </div>
    </div>
  );
}
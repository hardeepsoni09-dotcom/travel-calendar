import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, onSnapshot } from 'firebase/firestore';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([
    'Sydney',
    'Melbourne',
    'Perth',
    'Brisbane',
    'Darwin',
    'Delhi',
    'Mumbai',
    'Calcutta',
    'Bangalore',
  ]);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Listen to trips in Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'trips'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });

    return unsubscribe;
  }, [user]);

  // Listen to cities in Firestore
  useEffect(() => {
    const q = query(collection(db, 'cities'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length > 0) {
        const citiesData = snapshot.docs[0].data().list || [];
        setCities(citiesData);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">✈️ Au-India-Travel</h1>
          <p className="app-subtitle">Australian (Sydney) Chapter of ICAI Community</p>
        </div>
        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <span className="user-email">{user.email}</span>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="logout-btn"
          >
            Sign Out
          </button>
        </div>
      </header>

      <Dashboard user={user} trips={trips} cities={cities} />
      <footer className="app-footer">
        <p>Questions or feedback? Email: <a href="mailto:hardeep.soni09@gmail.com">hardeep.soni09@gmail.com</a></p>
      </footer>
    </div>
  );
}
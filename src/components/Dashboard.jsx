import { useState } from 'react';
import CheckTravelers from './CheckTravelers';
import AddTrip from './AddTrip';
import ManageCities from './ManageCities';
import '../styles/Dashboard.css';

export default function Dashboard({ user, trips, cities }) {
  const [activeView, setActiveView] = useState('home');

  return (
    <div className="dashboard">
      {activeView === 'home' && (
        <div className="home-view">
          <div className="welcome-section">
            <h2>Welcome back!</h2>
            <p className="welcome-subtitle">
              {trips.length} active trips in the community
            </p>
          </div>

          <div className="action-buttons">
            <button
              className="action-btn travelers-btn"
              onClick={() => setActiveView('travelers')}
            >
              <span className="btn-icon">📅</span>
              <span className="btn-text">
                <strong>Check Travelers</strong>
                <small>View community calendar</small>
              </span>
              <span className="btn-arrow">→</span>
            </button>

            <button
              className="action-btn add-btn"
              onClick={() => setActiveView('addtrip')}
            >
              <span className="btn-icon">✈️</span>
              <span className="btn-text">
                <strong>Add Travel Details</strong>
                <small>Share your trip</small>
              </span>
              <span className="btn-arrow">→</span>
            </button>

            <button
              className="action-btn cities-btn"
              onClick={() => setActiveView('cities')}
            >
              <span className="btn-icon">🏙️</span>
              <span className="btn-text">
                <strong>Manage Cities</strong>
                <small>Add or remove locations</small>
              </span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {trips.length > 0 && (
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-number">{trips.length}</div>
                <div className="stat-label">Total Trips</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {new Set(trips.map(t => t.origin)).size}
                </div>
                <div className="stat-label">Departure Cities</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {new Set(trips.map(t => t.destination)).size}
                </div>
                <div className="stat-label">Arrival Cities</div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'travelers' && (
        <CheckTravelers trips={trips} onBack={() => setActiveView('home')} />
      )}

      {activeView === 'addtrip' && (
        <AddTrip cities={cities} onBack={() => setActiveView('home')} />
      )}

      {activeView === 'cities' && (
        <ManageCities cities={cities} onBack={() => setActiveView('home')} />
      )}
    </div>
  );
}
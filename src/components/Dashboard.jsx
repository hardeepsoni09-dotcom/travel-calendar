import { useState, useMemo } from 'react';
import { auth } from '../firebase';
import CheckTravelers from './CheckTravelers';
import AddTrip from './AddTrip';
import ManageCities from './ManageCities';
import '../styles/Dashboard.css';

export default function Dashboard({ user, trips, cities }) {
  const [activeView, setActiveView] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Check if user is admin (in real app, check Firestore admins collection)
  // For now, we'll pass this from parent or check localStorage
  useState(() => {
    const adminUid = localStorage.getItem('adminUid');
    if (adminUid === auth.currentUser?.uid) {
      setIsAdmin(true);
    }
  }, []);

  // Calculate travelers by destination
  const travelersbyDestination = useMemo(() => {
    const destMap = {};
    trips.forEach((trip) => {
      if (!destMap[trip.destination]) {
        destMap[trip.destination] = [];
      }
      destMap[trip.destination].push(trip.name);
    });
    return destMap;
  }, [trips]);

  // Sort destinations by number of travelers
  const sortedDestinations = useMemo(() => {
    return Object.entries(travelersbyDestination)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 6); // Show top 6 destinations
  }, [travelersbyDestination]);

  const totalTravelers = useMemo(() => new Set(trips.map(t => t.name)).size, [trips]);

  return (
    <div className="dashboard">
      {activeView === 'home' && (
        <div className="home-view">
          <div className="welcome-section">
            <h2>Welcome back!</h2>
            <p className="welcome-subtitle">
              {trips.length} active trips • {totalTravelers} travelers in community
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

            {isAdmin && (
              <button
                className="action-btn cities-btn"
                onClick={() => setActiveView('cities')}
              >
                <span className="btn-icon">🏙️</span>
                <span className="btn-text">
                  <strong>Manage Cities</strong>
                  <small>Admin only</small>
                </span>
                <span className="btn-arrow">→</span>
              </button>
            )}
          </div>

          {/* DESTINATION WIDGET */}
          <div className="destination-widget">
            <h3>Travelers by Destination</h3>
            <p className="widget-subtitle">Click to see who's traveling where</p>

            <div className="destination-grid">
              {sortedDestinations.map(([destination, travelers]) => (
                <div
                  key={destination}
                  className="destination-card"
                  onClick={() => setSelectedDestination(
                    selectedDestination === destination ? null : destination
                  )}
                >
                  <div className="destination-header">
                    <h4>{destination}</h4>
                    <span className="traveler-count">{travelers.length}</span>
                  </div>

                  {selectedDestination === destination && (
                    <div className="destination-travelers">
                      <ul>
                        {travelers.map((name, idx) => (
                          <li key={idx}>✈️ {name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {sortedDestinations.length === 0 && (
              <div className="no-destinations">
                <p>No travelers yet. Be the first to add your trip! 🌍</p>
              </div>
            )}
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

      {activeView === 'cities' && isAdmin && (
        <ManageCities cities={cities} onBack={() => setActiveView('home')} />
      )}
    </div>
  );
}
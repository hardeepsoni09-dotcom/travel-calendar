import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CheckTravelers.css';

export default function CheckTravelers({ trips, onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const travelersOnDate = useMemo(() => {
    return trips.filter((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.returnDate);
      return selectedDate >= start && selectedDate <= end;
    });
  }, [trips, selectedDate]);

  const tileContent = ({ date }) => {
    const dateTravelers = trips.filter((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.returnDate);
      return date >= start && date <= end;
    });

    if (dateTravelers.length === 0) return null;

    return (
      <div className="calendar-badge">
        {dateTravelers.length}
      </div>
    );
  };

  const tileClassName = ({ date }) => {
    const hasTravelers = trips.some((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.returnDate);
      return date >= start && date <= end;
    });
    return hasTravelers ? 'has-travelers' : '';
  };

  return (
    <div className="check-travelers">
      <div className="travelers-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h2>📅 Community Travel Calendar</h2>
      </div>

      <div className="travelers-container">
        <div className="calendar-section">
          <h3>Select a Date</h3>
          <div className="calendar-wrapper">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
            />
          </div>
        </div>

        <div className="travelers-section">
          <h3>
            Travelers on{' '}
            <span className="date-highlight">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </h3>

          {travelersOnDate.length === 0 ? (
            <div className="no-travelers">
              <div className="empty-icon">🛫</div>
              <p>No travelers on this date</p>
            </div>
          ) : (
            <div className="travelers-grid">
              {travelersOnDate.map((trip) => (
                <div key={trip.id} className="traveler-card">
                  <div className="traveler-header">
                    <div className="traveler-name">{trip.name}</div>
                  </div>
                  <div className="traveler-route">
                    <span className="city-badge from">{trip.origin}</span>
                    <span className="route-arrow">→</span>
                    <span className="city-badge to">{trip.destination}</span>
                  </div>
                  <div className="traveler-dates">
                    <div className="date-item">
                      <span className="date-label">Depart:</span>
                      <span className="date-value">
                        {new Date(trip.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Return:</span>
                      <span className="date-value">
                        {new Date(trip.returnDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
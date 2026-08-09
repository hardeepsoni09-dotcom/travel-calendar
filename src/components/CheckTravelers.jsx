import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CheckTravelers.css';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function CheckTravelers({ onBack }) {
  const [trips, setTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTravelers, setSelectedTravelers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'trips'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getTravelersByDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return trips.filter((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.returnDate);
      const current = new Date(dateStr);
      return current >= start && current <= end;
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const travelers = getTravelersByDate(date);
    setSelectedTravelers(travelers);
  };

  const getTravelerInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDatesWithTravelers = () => {
    const datesSet = new Set();
    trips.forEach((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.returnDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        datesSet.add(d.toISOString().split('T')[0]);
      }
    });
    return datesSet;
  };

  const datesWithTravelers = getDatesWithTravelers();

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (datesWithTravelers.has(dateStr)) {
        const travelers = getTravelersByDate(date);
        const initials = travelers
          .slice(0, 3)
          .map((t) => getTravelerInitials(t.name))
          .join(', ');

        return (
          <div className="calendar-badge">
            <span>{initials}</span>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="check-travelers-container">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <h2>Community Travel Calendar</h2>

      <div className="calendar-wrapper">
        <Calendar
          value={selectedDate}
          onChange={handleDateClick}
          tileContent={tileContent}
          minDate={new Date(2026, 0, 1)}
          maxDate={new Date(2027, 11, 31)}
        />
      </div>

      <div className="travelers-info">
        <div className="selected-date-display">
          <h3>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
        </div>

        {selectedTravelers.length > 0 ? (
          <div className="travelers-list">
            {selectedTravelers.map((traveler) => (
              <div key={traveler.id} className="traveler-card">
                <div className="traveler-info">
                  <h4>{traveler.name}</h4>
                  <p>
                    <strong>Email:</strong> {traveler.email}
                  </p>
                  <p>
                    <strong>Route:</strong> {traveler.origin} → {traveler.destination}
                  </p>
                  <p>
                    <strong>Dates:</strong>{' '}
                    {new Date(traveler.startDate).toLocaleDateString()} to{' '}
                    {new Date(traveler.returnDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-travelers">
            <p>No travelers on this date</p>
          </div>
        )}
      </div>
    </div>
  );
}
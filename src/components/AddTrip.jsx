import { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/AddTrip.css';

export default function AddTrip({ cities, onBack }) {
  const [form, setForm] = useState({
    name: '',
    origin: cities[0] || 'Sydney',
    destination: cities[5] || 'Delhi',
    startDate: '',
    returnDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.startDate || !form.returnDate) {
      setError('Please fill all required fields');
      return;
    }

    if (new Date(form.startDate) > new Date(form.returnDate)) {
      setError('Return date must be after start date');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'trips'), {
        ...form,
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setError('Failed to add trip. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onBack}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✈️ Add Your Travel Details</h2>
          <button className="close-btn" onClick={onBack}>
            ✕
          </button>
        </div>

        {success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>Trip added successfully!</p>
            <small>You're visible to the community now.</small>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="trip-form">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="origin">From (Origin) *</label>
                <select
                  id="origin"
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  required
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="destination">To (Destination) *</label>
                <select
                  id="destination"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  required
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Departure Date *</label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="returnDate">Return Date *</label>
                <input
                  id="returnDate"
                  type="date"
                  name="returnDate"
                  value={form.returnDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Adding Trip...' : 'Add Trip to Community'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
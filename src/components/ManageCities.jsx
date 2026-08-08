import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, setDoc, doc } from 'firebase/firestore';
import '../styles/ManageCities.css';

export default function ManageCities({ cities, onBack }) {
  const [cityList, setCityList] = useState(cities);
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(false);

  // Save cities to Firestore
  const saveCitiesToFirestore = async (updatedCities) => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'cities', 'list'), { list: updatedCities });
    } catch (err) {
      console.error('Error saving cities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = () => {
    if (!newCity.trim()) return;
    if (cityList.includes(newCity)) {
      alert('City already exists');
      return;
    }

    const updated = [...cityList, newCity];
    setCityList(updated);
    saveCitiesToFirestore(updated);
    setNewCity('');
  };

  const handleRemoveCity = (city) => {
    const updated = cityList.filter((c) => c !== city);
    setCityList(updated);
    saveCitiesToFirestore(updated);
  };

  return (
    <div className="manage-cities">
      <header className="view-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h2>🏙️ Manage Cities</h2>
      </header>

      <div className="cities-content">
        <div className="add-city-form">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCity()}
            placeholder="Enter city name"
          />
          <button onClick={handleAddCity} disabled={loading}>
            Add
          </button>
        </div>

        <div className="cities-list">
          <h3>Available Cities ({cityList.length})</h3>
          {cityList.map((city) => (
            <div key={city} className="city-item">
              <span>{city}</span>
              <button
                onClick={() => handleRemoveCity(city)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
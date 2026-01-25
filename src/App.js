import React, { useState } from 'react';
import './App.css'; // Importing the separate CSS file
import { Oval } from "react-loader-spinner";

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/classify-disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diseaseName: query }),
      });

      if (!response.ok) throw new Error('Server not responding');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to connect to the medical server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Search Speciality</h1>
      </header>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter disease name (e.g. Hypertension)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Identify"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loader-container">
          <Oval
            height={90}
            width={90}
            color="#f4f4f4"
            secondaryColor="#01ff05"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        result && (
          <div className="result-card">
            <div className="card-header">
              <h2>{result.disease}</h2>
            </div>
            <div className="card-body">
              <div className="info-item">
                <label>Medical Specialty</label>
                <p>{result.specialty}</p>
              </div>
            </div>
          </div>
        )
      )}
      <div className="credit">
        Designed & Developed <br /> By <span>Salman</span>
      </div>
    </div>
  );
}
export default App;
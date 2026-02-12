import React, { useState, useEffect } from 'react';
import './App.css';
import { Oval } from "react-loader-spinner";

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // New state for empty input validation
  const [inputError, setInputError] = useState(false);

  // Toggle Theme Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Check if search box is empty
    if (!query.trim()) {
      setInputError(true);
      setResult(null);
      setError(null);
      return;
    }

    // Reset states for a valid search
    setInputError(false);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://mrrecodsai-backend-1.onrender.com/api/classify-disease', {
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
      <div className="toggle-container">
        <span className="toggle-label">{isDarkMode ? '🌙 DARK ' : '☀️ LIGHT'}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      <header className="header">
        <h1>Search Speciality</h1>
      </header>

      <form className={`search-box ${inputError ? 'input-error-border' : ''}`} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter disease name (e.g. Hypertension)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (inputError) setInputError(false); // Remove error when user starts typing
          }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Identify"}
        </button>
      </form>

      {/* Red validation message for empty input */}
      {inputError && (
        <div className="validation-message">
          Please enter a disease name
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loader-container">
          <Oval
            height={90}
            width={90}
            color={isDarkMode ? "#00ffff" : "#1a56db"}
            secondaryColor="#01ff05"
            strokeWidth={2}
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
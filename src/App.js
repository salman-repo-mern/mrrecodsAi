import React, { useState, useEffect } from 'react';
import './App.css';
import ParticlesBackground from './ParticlesBackground';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(false);


  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });;

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);


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
    <div className="app-wrapper">
      <ParticlesBackground isDarkMode={isDarkMode} />
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
          <div className="search-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for a disease diagnosis..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (inputError) setInputError(false); // Remove error when user starts typing
            }}
          />
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? (
              <span className="btn-text">Searching...</span>
            ) : (
              <>
                <span className="btn-text">Identify</span>
                <svg className="btn-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
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
            <svg className="ecg-loader" viewBox="0 0 200 100">
              <polyline
                className="ecg-line"
                points="0,50 60,50 70,30 80,70 90,10 100,90 110,30 120,50 200,50"
              />
            </svg>
            <div className="loading-text">Analyzing disease...</div>
          </div>
        ) : (
          result && (
            <div className="result-card">
              <div className="card-header">
                <div className="header-icon-title">
                  <div className="medical-icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2>{result.disease}</h2>
                </div>
              </div>
              <div className="card-body">
                <div className="info-item hover-effect">
                  <div className="info-item-icon">
                    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="info-text">
                    <label>Recommended Specialty</label>
                    <p>{result.specialty}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        <div className="credit">
          Designed & Developed <br /> By <span>Salman</span>
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import EventsList from './components/EventsList';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app ${!isDarkMode ? 'light-mode' : ''}`}>
      <div className="dark-mode-toggle">
        <button onClick={toggleMode}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>
      </div>

      <div className="container" id="events-container">
        <h1>Upcoming Events</h1>
        <EventsList />
      </div>

      <div className="container">
        <h1>Calendar</h1>
        <Calendar />
      </div>
    </div>
  );
}

export default App;
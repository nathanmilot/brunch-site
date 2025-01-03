import React, { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar() {
  const [calendarUrl, setCalendarUrl] = useState('');

  useEffect(() => {
    const loadSecrets = async () => {
      try {
        const response = await fetch('/secrets.json');
        const data = await response.json();
        const calendarOptions = '&mode=AGENDA&showPrint=0&showCalendars=0';
        setCalendarUrl(data.calendarUrl + calendarOptions);
      } catch (error) {
        console.error('Error loading secrets:', error);
      }
    };

    loadSecrets();
  }, []);

  return (
    <iframe
      className="calendar-frame raised"
      src={calendarUrl}
      style={{ border: 0 }}
      width="800"
      height="600"
      frameBorder="0"
      scrolling="no"
      title="Calendar"
    />
  );
}

export default Calendar;
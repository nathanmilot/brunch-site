import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import './EventsList.css';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [defaultLocation, setDefaultLocation] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const secretsResponse = await fetch('/secrets.json');
        const secretsData = await secretsResponse.json();
        setDefaultLocation(decodeURIComponent(secretsData.defaultLocation));

        const eventsResponse = await fetch('/data/events.json');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="events-list">
      {events.map((event, index) => (
        <EventCard
          key={index}
          event={event}
          defaultLocation={defaultLocation}
        />
      ))}
    </div>
  );
}

export default EventsList;
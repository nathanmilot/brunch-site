import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faUtensils } from '@fortawesome/free-solid-svg-icons';
import * as utils from '../utils';
import './EventCard.css';

function EventCard({ event, defaultLocation }) {
  const { details, description, menu } = event;

    // Parse the combined date and time string
    const eventDate = new Date(details.date);
  
    const formattedDateTime = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/New_York'
    }).format(eventDate);

  // Create a div element to safely render HTML content
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <div className="event-card">
      <div className="event-card__header">
        <h2 className="event-card__title">{details.title}</h2>
        <div className="event-card__date">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span>{formattedDateTime}</span>
        </div>
      </div>

      <div className="event-card__location">
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        <span
          dangerouslySetInnerHTML={
            createMarkup(details?.location ?? defaultLocation)
          }
        />
      </div>

      <div className="event-card__description">
        {description}
      </div>

      {menu && menu.length > 0 && (
        <div className="event-card__menu">
          <div className="event-card__menu-header">
            <FontAwesomeIcon icon={faUtensils} />
            <span>This Month's Menu</span>
          </div>
          <div className="event-card__menu-items">
            {menu.map((item, index) => (
              <span key={index} className="menu-item">
                {utils.titleCase(item)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventCard;
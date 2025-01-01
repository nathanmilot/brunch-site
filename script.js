var defaultLocation = "";

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}


// Path to the dynamically created secrets file
const secretsPath = './secrets.json';

// Fetch the secrets JSON file
fetch(secretsPath)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to load secrets.json');
    }
    return response.json();
  })
  .then((data) => {
    // Update Google Calendar iframe
    const calendar = document.getElementById('calendar');
    if (calendar) {
      calendar.src = data.calendarUrl;
    }

    // Update default location display
    defaultLocation = decodeURIComponent(data.defaultLocation);
  })
  .then( () => {
    fetch('./data/events.json')
      .then(response => response.json())
      .then(data => {
        const eventsList = document.getElementById('events-list');

        data.events.forEach(event => {
          const { details, description, menu } = event;
          const li = document.createElement('li');
          li.innerHTML = `
        <strong>${details.date}</strong>: ${details.title} 
        <br>Location: ${details?.location ?? defaultLocation}
        <p>${description}</p>
        <p>Menu: <br>${menu.map(function (item) {return titleCase(item)}).join(", ")}</p>
      `;
          eventsList.appendChild(li);
        });
      })
      .catch(error => console.error('Error loading JSON:', error));
  })
  .catch((error) => {
    console.error('Error loading secrets:', error);
  });

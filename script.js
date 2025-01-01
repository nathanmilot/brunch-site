var defaultLocation = "";

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

// Check the system theme preference on page load
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme based on system preference
const icon = document.getElementById("toggle-icon");
if (systemPrefersDark) {
  document.body.classList.add('light-mode');
  icon.classList.add('fa-moon');
} else {
  document.body.classList.remove('light-mode');
  icon.classList.add('fa-sun');
}

// Function to toggle the mode
const toggleMode = () => {
  const body = document.body;
  body.classList.toggle('light-mode');
  
  // Toggle between sun and moon icons
  const icon = document.getElementById("toggle-icon");
  if (body.classList.contains('light-mode')) {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
};


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
          li.classList.add("raised");
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

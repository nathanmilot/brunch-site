var defaultLocation = "";

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createEventCard(event) {
  const eventDateTime = new Date(event.details.date);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York'
  }).format(eventDateTime);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'America/New_York'
  }).format(eventDateTime);

  return `<div class="event-card">
      <div class="event-card__header">
        <h2 class="event-card__title">${event.details.title}</h2>
        <div class="event-card__date">
          <i class="fas fa-calendar-days"></i>
          <span>
            <span class="event-card__accent">${formattedDate}</span>
            <span class="event-card__accent">${formattedTime}</span>
          </span>
        </div>
      </div>
      
      <div class="event-card__location">
        <i class="fa-solid fa-location-dot"></i>
        <span>${event.details?.location ?? defaultLocation}</span>
      </div>

      <div class="event-card__description">
        ${event.description}
      </div>

      ${event.menu && event.menu.length > 0 && (
      `<div class="event-card__menu">
        <div class="event-card__menu-header">
          <i class="fa-solid fa-utensils"></i>
          <span class="event-card__accent">This Month's Menu</span>
        </div>
        <div class="event-card__menu-items">
          ${event.menu.map(
        function (item, index) {
          return `<span key=${index} class="menu-item">${titleCase(item)}</span>`;
        }
      ).join("")
      }
        </div >
      </div >`
    )
    }
    </div > `;
}

const systemPrefersDark = () =>
  window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false;

// Set initial theme based on system preference
const icon = document.getElementById("toggle-icon");
if (systemPrefersDark()) {
  document.body.classList.remove("light-mode");
  icon.classList.add("fa-sun");
} else {
  document.body.classList.add("light-mode");
  icon.classList.add("fa-moon");
}

// Function to toggle the mode
const toggleMode = () => {
  const body = document.body;
  body.classList.toggle("light-mode");
  body.class;

  // Toggle between sun and moon icons
  const icon = document.getElementById("toggle-icon");
  if (body.classList.contains("light-mode")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
};

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    toggleMode();
  });

// Path to the dynamically created secrets file
const secretsPath = "./secrets.json";

// Fetch the secrets JSON file
fetch(secretsPath)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load secrets.json");
    }
    return response.json();
  })
  .then((data) => {
    // Update Google Calendar iframe
    const calendar = document.getElementById("calendar");
    if (calendar) {
      const calendarOptions =
        "&mode=AGENDA&showPrint=0&showCalendars=0";
      calendar.src = data.calendarUrl + calendarOptions;
    }

    // Update default location display
    defaultLocation = decodeURIComponent(data.defaultLocation);
  })
  .then(() => {
    fetch("./data/events.json")
      .then((response) => response.json())
      .then((data) => {
        const eventsList = document.getElementById("events-list");

        data.events.forEach((event) => {
          const li = document.createElement("li");
          li.classList.add("raised");
          li.innerHTML = createEventCard(event);
          eventsList.appendChild(li);
        });
      })
      .catch((error) => console.error("Error loading JSON:", error));
  })
  .catch((error) => {
    console.error("Error loading secrets:", error);
  });

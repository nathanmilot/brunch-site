var defaultLocation = "";
var foundCurrent = false;

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createEventCard(event) {
  var otherClass = "";
  const today = new Date();
  const eventDateTime = new Date(event.details.date);
  if (
    (today.getMonth() == eventDateTime.getMonth() &&
      today.getDate() <= eventDateTime.getDate()) ||
    (today.getMonth() == eventDateTime.getMonth() - 1 && !foundCurrent)
  ) {
    otherClass = "current";
    foundCurrent = true;
  } else if (
    today.getMonth() > eventDateTime.getMonth() ||
    (today.getMonth() == eventDateTime.getMonth() &&
      today.getDate() > eventDateTime.getDate())
  ) {
    otherClass = "past";
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(eventDateTime);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "America/New_York",
  }).format(eventDateTime);

  const rsvpLink = `https://docs.google.com/forms/d/e/1FAIpQLSdVdWo2GT9l9NopHPvBdGQlBh9tvb8r5W4Ss9lRrkQU79TFWg/viewform?usp=pp_url&entry.1280776439=${
    event.details.date.split("T")[0]
  }`;

  return `<div class="event-card${otherClass ? " " + otherClass : ""}">
      <div class="event-card__header">
        <div>  
          <h2 class="event-card__title">${event.details.title}</h2>
          <div class="event-card__location">
            <i class="fa-solid fa-location-dot"></i>
            <div>${event.details?.location ?? defaultLocation}</div>
          </div>
        </div>
        <div class="event-card__date">
          <i class="fas fa-calendar-days"></i>
          <div>
            <div class="event-card__accent">${formattedDate}</div>
            <div class="event-card__accent">${formattedTime}</div>
          </div>
        </div>
      </div>      

      ${
        event?.description && event?.description.length > 0
          ? `<div class="event-card__description">${event?.description}</div>`
          : ``
      }

      <a class="rsvp" type="button" href='${rsvpLink}' target="-blank">RSVP</a>

      ${`<div class="event-card__menu">
          <div class="event-card__menu-header">
            <i class="fa-solid fa-utensils"></i>
            <span class="event-card__accent">This Month's Menu</span>
          </div>
          <div class="event-card__menu-items">
            ${
              event?.menu?.length > 0
                ? event.menu
                    .map(function (item, index) {
                      return `<span key=${index} class="menu-item">${titleCase(item)}</span>`;
                    })
                    .join("")
                : `<span class="menu-item">TBD</span>`
            } 
          </div >
        </div >`}
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
        "&showPrint=0&showCalendars=0&showTz=0&showTitle=0&mode=AGENDA&hl=en&";
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

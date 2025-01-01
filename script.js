var defaultLocation = "";

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const systemPrefersDark = () =>
  window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false;

// Set initial theme based on system preference
const icon = document.getElementById("toggle-icon");
if (systemPrefersDark) {
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
  .addEventListener("change", (event) => {
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
      calendar.src = data.calendarUrl;
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
          const { details, description, menu } = event;
          const li = document.createElement("li");
          li.classList.add("raised");
          li.innerHTML = `
        <span><strong>${details.date}</strong>: ${details.title} </span>
        <br><span>Location: ${details?.location ?? defaultLocation}</span>
        ${description}
        <br><br>This Month's Menu: <br>${menu
          .map(function (item) {
            return titleCase(item);
          })
          .join(", ")}
      `;
          eventsList.appendChild(li);
        });
      })
      .catch((error) => console.error("Error loading JSON:", error));
  })
  .catch((error) => {
    console.error("Error loading secrets:", error);
  });

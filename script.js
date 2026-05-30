// Simulation Control
let simulationEnabled = false;

window.enableTesting = function () {
  simulationEnabled = true;
  document.querySelector(".simulation-controls").style.display = "block";

  // Default sim date if empty
  const simDateInput = document.getElementById("simDate");
  if (!simDateInput.value) {
    simDateInput.value = "2026-06-01";
  }

  updateSimulationUI();
  console.log("Simulation mode enabled.");
};

function getToday() {
  if (simulationEnabled) {
    const simVal = document.getElementById("simDate").value;
    if (simVal) return new Date(simVal + "T12:00:00");
  }
  return new Date();
}

function updateSimulationUI() {
  if (simulationEnabled) {
    const today = getToday();
    const display = document.getElementById("currentDateDisplay");
    if (display) {
      display.innerText = "Simulated Today: " + formatDate(today);
    }
  }
}

function findStreet(query) {
  if (!query || query.trim().length < 2) return [];
  let cleanQuery = query.toLowerCase().trim();

  // Remove common suffixes to match user input like "Cedar Rd" to data "Cedar"
  const suffixRegex =
    /\s+(road|rd|street|st|avenue|ave|boulevard|blvd|drive|dr|lane|ln|court|ct|place|pl|terrace|ter|circle|cir|way|parkway|pkwy|oval)\.?$/i;
  cleanQuery = cleanQuery.replace(suffixRegex, "").trim();

  return STREET_DATA.filter((s) => s.name.toLowerCase().includes(cleanQuery));
}

// Returns the A/B route for the week containing the given date
function getWeekRoute(date) {
  const aRouteStart = new Date(A_ROUTE_START + "T12:00:00");
  const monday = getMondayOf(date);
  const timeDiff = monday.getTime() - aRouteStart.getTime();
  const weeksDiff = Math.round(timeDiff / (1000 * 3600 * 24 * 7));
  if (weeksDiff % 2 === 0) return "A";
  return "B";
}

// Get the Monday of the week containing date
function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day == 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(12, 0, 0, 0);
  return d;
}

// Apply holiday delay to a pickup date
function applyHolidayDelay(pickupDate, queryDate) {
  const currentMonday = getMondayOf(pickupDate);
  const weekEnd = new Date(currentMonday);
  weekEnd.setDate(currentMonday.getDate() + 6);

  let delay = 0;
  for (let h of HOLIDAYS_2026) {
    const hDate = new Date(h.date + "T12:00:00");
    if (hDate >= currentMonday && hDate <= weekEnd) {
      if (hDate.getDay() >= 1 && hDate.getDay() <= 5) {
        if (hDate <= pickupDate) {
          delay = 1;
        }
      }
    }
  }

  let adjustedDate = new Date(pickupDate);
  adjustedDate.setDate(pickupDate.getDate() + delay);

  const qDateNorm = new Date(queryDate);
  qDateNorm.setHours(12, 0, 0, 0);

  if (adjustedDate >= qDateNorm) {
    return { date: adjustedDate, delay: delay };
  }
  return null;
}

// Find next recycling pickup (every other week, route A or B)
function getNextRecyclingDate(route, standardDayStr, queryDate) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const standardDayIdx = days.indexOf(standardDayStr);

  let currentMonday = getMondayOf(queryDate);

  for (let i = 0; i < 12; i++) {
    const weekRoute = getWeekRoute(currentMonday);

    if (weekRoute === route) {
      let pickupDate = new Date(currentMonday);
      pickupDate.setDate(currentMonday.getDate() + (standardDayIdx - 1));

      const result = applyHolidayDelay(pickupDate, queryDate);
      if (result) return result;
    }

    currentMonday.setDate(currentMonday.getDate() + 7);
  }
  return null;
}

// Find next rubbish pickup (every week, no A/B cycle)
function getNextRubbishDate(standardDayStr, queryDate) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const standardDayIdx = days.indexOf(standardDayStr);

  let currentMonday = getMondayOf(queryDate);

  for (let i = 0; i < 12; i++) {
    let pickupDate = new Date(currentMonday);
    pickupDate.setDate(currentMonday.getDate() + (standardDayIdx - 1));

    const result = applyHolidayDelay(pickupDate, queryDate);
    if (result) return result;

    currentMonday.setDate(currentMonday.getDate() + 7);
  }
  return null;
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function checkHolidayWeek(today) {
  const alertBox = document.getElementById("globalAlert");

  let currentMonday = getMondayOf(today);
  const weekEnd = new Date(currentMonday);
  weekEnd.setDate(currentMonday.getDate() + 6);

  let holidayFound = null;
  let holidayDayIndex = -1;

  for (let h of HOLIDAYS_2026) {
    const hDate = new Date(h.date + "T12:00:00");
    if (hDate >= currentMonday && hDate <= weekEnd) {
      if (hDate.getDay() >= 1 && hDate.getDay() <= 5) {
        holidayFound = h;
        holidayDayIndex = hDate.getDay();
        break;
      }
    }
  }

  if (holidayFound) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[holidayDayIndex];

    let msg = `<strong>Holiday Week:</strong> `;
    if (holidayDayIndex === 1) {
      msg += "Pickup will be delayed by a day.";
    } else {
      msg += `Pickup delayed by a day for routes on or after ${dayName}.`;
    }

    alertBox.innerHTML = msg;
    alertBox.style.display = "block";
  } else {
    alertBox.style.display = "none";
  }
}

function createGoogleCalendarLink(date, streetName, pickupType) {
  const title = encodeURIComponent(`${pickupType} Pickup`);
  const details = encodeURIComponent(`${pickupType} Pickup for ${streetName}`);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  const ny = nextDay.getFullYear();
  const nm = String(nextDay.getMonth() + 1).padStart(2, "0");
  const nd = String(nextDay.getDate()).padStart(2, "0");

  const dateStrStart = `${y}${m}${d}`;
  const dateStrEnd = `${ny}${nm}${nd}`;
  const dates = `${dateStrStart}/${dateStrEnd}`;

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
}

function findSchedule() {
  const input = document.getElementById("streetInput").value;
  const resultsDiv = document.getElementById("results");
  const today = getToday();

  checkHolidayWeek(today);
  updateSimulationUI();

  resultsDiv.innerHTML = "";

  const matches = findStreet(input);

  if (matches.length === 0) {
    if (input.trim().length > 0) {
      resultsDiv.innerHTML =
        '<div class="error">No street found matching "' +
        input +
        '". Please try again.</div>';
    }
    return;
  }

  matches.forEach((match) => {
    const rubbishResult = getNextRubbishDate(match.day, today);
    const recyclingResult = getNextRecyclingDate(match.route, match.day, today);

    const card = document.createElement("div");
    card.className = "result-card";

    let streetTitle = match.name;
    if (match.segment) {
      streetTitle += ` <small>(${match.segment})</small>`;
    }

    let html = `<h3>${streetTitle}</h3>`;
    html += `<p class="route-info">Route ${match.route} &bull; Regular Schedule: ${match.day}</p>`;

    // Rubbish pickup (every week)
    if (rubbishResult) {
      const standardDay = match.day;
      const pickupDay = rubbishResult.date.toLocaleDateString("en-US", {
        weekday: "long",
      });
      let delayHtml = "";
      if (standardDay !== pickupDay) {
        delayHtml = `<div class="delay-note">⚠️ Schedule adjusted for holiday</div>`;
      }

      html += `<div class="pickup-item rubbish">`;
      html += `<div class="pickup-header">🗑️ Rubbish Pickup (Weekly)</div>`;
      html += `<div class="date-display">Next: ${formatDate(rubbishResult.date)}</div>`;
      html += delayHtml;

      const rCalLink = createGoogleCalendarLink(
        rubbishResult.date,
        match.name,
        "Rubbish",
      );
      html += `<div class="cal-link">`;
      html += `<a href="${rCalLink}" target="_blank">📅 Add to Calendar</a>`;
      html += `</div>`;
      html += `</div>`;
    }

    // Recycling pickup (every other week)
    if (recyclingResult) {
      const standardDay = match.day;
      const pickupDay = recyclingResult.date.toLocaleDateString("en-US", {
        weekday: "long",
      });
      let delayHtml = "";
      if (standardDay !== pickupDay) {
        delayHtml = `<div class="delay-note">⚠️ Schedule adjusted for holiday</div>`;
      }

      html += `<div class="pickup-item recycling">`;
      html += `<div class="pickup-header">♻️ Recycling Pickup (Route ${match.route} Weeks)</div>`;
      html += `<div class="date-display">Next: ${formatDate(recyclingResult.date)}</div>`;
      html += delayHtml;

      const gCalLink = createGoogleCalendarLink(
        recyclingResult.date,
        match.name,
        "Recycling",
      );
      html += `<div class="cal-link">`;
      html += `<a href="${gCalLink}" target="_blank">📅 Add to Calendar</a>`;
      html += `</div>`;
      html += `</div>`;
    }

    if (!rubbishResult && !recyclingResult) {
      html += `<div class="error">Could not determine next pickup date.</div>`;
    }

    card.innerHTML = html;
    resultsDiv.appendChild(card);
  });
}

// Initial display
const initialDate = getToday();
checkHolidayWeek(initialDate);

// Add event listener for Enter key
document
  .getElementById("streetInput")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      findSchedule();
    }
  });

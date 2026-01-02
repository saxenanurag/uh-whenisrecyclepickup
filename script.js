// Simulation Control
let simulationEnabled = false;

window.enableTesting = function () {
    simulationEnabled = true;
    document.querySelector('.simulation-controls').style.display = 'block';

    // Default sim date if empty
    const simDateInput = document.getElementById('simDate');
    if (!simDateInput.value) {
        simDateInput.value = '2026-01-01';
    }

    updateSimulationUI();
    console.log("Simulation mode enabled.");
};

function getToday() {
    if (simulationEnabled) {
        const simVal = document.getElementById('simDate').value;
        if (simVal) return new Date(simVal + "T12:00:00");
    }
    return new Date();
}

function updateSimulationUI() {
    if (simulationEnabled) {
        const today = getToday();
        const display = document.getElementById('currentDateDisplay');
        if (display) {
            display.innerText = "Simulated Today: " + formatDate(today);
        }
    }
}

function findStreet(query) {
    if (!query || query.trim().length < 2) return [];
    let cleanQuery = query.toLowerCase().trim();

    // Remove common suffixes to match user input like "Cedar Rd" to data "Cedar"
    const suffixRegex = /\s+(road|rd|street|st|avenue|ave|boulevard|blvd|drive|dr|lane|ln|court|ct|place|pl|terrace|ter|circle|cir|way|parkway|pkwy|oval)\.?$/i;
    cleanQuery = cleanQuery.replace(suffixRegex, "").trim();

    return STREET_DATA.filter(s => s.name.toLowerCase().includes(cleanQuery));
}

function getNextPickupDate(route, standardDayStr, queryDate) {
    // standardDayStr: "Monday", "Tuesday", etc.
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const standardDayIdx = days.indexOf(standardDayStr);

    // Iterate weeks starting from the week of queryDate
    let currentMonday = new Date(queryDate);
    const day = currentMonday.getDay();
    const diff = currentMonday.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    currentMonday.setDate(diff);
    currentMonday.setHours(12, 0, 0, 0);

    // Reference A Route Start: Jan 5 2026
    const aRouteStart = new Date(A_ROUTE_START + "T12:00:00");

    // Look ahead up to 4 weeks
    for (let i = 0; i < 4; i++) {
        const timeDiff = currentMonday.getTime() - aRouteStart.getTime();
        const weeksDiff = Math.round(timeDiff / (1000 * 3600 * 24 * 7));

        let currentWeekRoute = (weeksDiff % 2 === 0) ? "A" : "B";
        if (weeksDiff % 2 !== 0) currentWeekRoute = "B";

        if (currentWeekRoute === route) {
            let pickupDate = new Date(currentMonday);
            pickupDate.setDate(currentMonday.getDate() + (standardDayIdx - 1));

            let delay = 0;
            const weekEnd = new Date(currentMonday);
            weekEnd.setDate(currentMonday.getDate() + 6);

            for (let h of HOLIDAYS_2026) {
                const hDate = new Date(h.date + "T12:00:00");
                if (hDate >= currentMonday && hDate <= weekEnd) {
                    if (hDate.getDay() <= standardDayIdx && hDate.getDay() !== 0 && hDate.getDay() !== 6) {
                        delay = 1;
                    }
                }
            }

            pickupDate.setDate(pickupDate.getDate() + delay);

            const qDateNorm = new Date(queryDate);
            qDateNorm.setHours(12, 0, 0, 0);

            if (pickupDate >= qDateNorm) {
                return pickupDate;
            }
        }

        currentMonday.setDate(currentMonday.getDate() + 7);
    }
    return null;
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function checkHolidayWeek(today) {
    const alertBox = document.getElementById('globalAlert');

    let currentMonday = new Date(today);
    const day = currentMonday.getDay();
    const diff = currentMonday.getDate() - day + (day == 0 ? -6 : 1);
    currentMonday.setDate(diff);
    currentMonday.setHours(12, 0, 0, 0);

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
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[holidayDayIndex];

        let msg = `<strong>Holiday Week:</strong> `;
        if (holidayDayIndex === 1) {
            msg += "Pickup will be delayed by a day.";
        } else {
            msg += `Pickup delayed by a day for routes on or after ${dayName}.`;
        }

        alertBox.innerHTML = msg;
        alertBox.style.display = 'block';
    } else {
        alertBox.style.display = 'none';
    }
}

function createGoogleCalendarLink(date, streetName) {
    const title = encodeURIComponent("Recycling Pickup");
    const details = encodeURIComponent(`University Heights Recycling Pickup for ${streetName}`);

    // Date format: YYYYMMDD/YYYYMMDD (all day event)
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    // Note: Google Calendar requires the end date to be the day after for a single all-day event,
    // OR just passing the same day works in some contexts, but strictly strictly standard is YYYYMMDD/YYYYMM(DD+1).
    // However, for simplicity and safety across timezones, let's try the simple YYYYMMDD/YYYYMMDD approach first,
    // but actually, Google Calendar API for render action usually takes YYYYMMDD/YYYYMMDD for single day if it's inclusive?
    // Let's verify standard behavior. Actually, for a one-day all-day event, start=20260105 and end=20260106 is the robust way.

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    const ny = nextDay.getFullYear();
    const nm = String(nextDay.getMonth() + 1).padStart(2, '0');
    const nd = String(nextDay.getDate()).padStart(2, '0');

    const dateStrStart = `${y}${m}${d}`;
    const dateStrEnd = `${ny}${nm}${nd}`;

    const dates = `${dateStrStart}/${dateStrEnd}`;

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
}

function findSchedule() {
    const input = document.getElementById('streetInput').value;
    const resultsDiv = document.getElementById('results');
    const today = getToday();

    checkHolidayWeek(today);
    updateSimulationUI();

    resultsDiv.innerHTML = '';

    const matches = findStreet(input);

    if (matches.length === 0) {
        if (input.trim().length > 0) {
            resultsDiv.innerHTML = '<div class="error">No street found matching "' + input + '". Please try again.</div>';
        }
        return;
    }

    matches.forEach(match => {
        const nextDate = getNextPickupDate(match.route, match.day, today);

        const card = document.createElement('div');
        card.className = 'result-card';

        let streetTitle = match.name;
        if (match.segment) {
            streetTitle += ` <small>(${match.segment})</small>`;
        }

        let html = `<h3>${streetTitle}</h3>`;
        html += `<p class="route-info">Route ${match.route} &bull; Regular Schedule: ${match.day}</p>`;

        if (nextDate) {
            const standardDay = match.day;
            const pickupDay = nextDate.toLocaleDateString('en-US', { weekday: 'long' });
            let delayHtml = "";
            if (standardDay !== pickupDay) {
                delayHtml = `<div class="delay-note">⚠️ Schedule adjusted for holiday</div>`;
            }

            html += `<div class="date-display">Next Pickup: ${formatDate(nextDate)}</div>`;
            html += delayHtml;

            // Add Google Calendar Buttons
            const gCalLink = createGoogleCalendarLink(nextDate, match.name);
            html += `<div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="${gCalLink}" target="_blank" style="display: inline-flex; align-items: center; padding: 8px 12px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-size: 0.9em; font-weight: 500;">
                    <span style="margin-right: 5px;">📅</span> Add Next Pickup
                </a>
                <button onclick="downloadFullSchedule('${match.route}', '${match.day}', '${match.name}', '${match.segment || ''}')" style="display: inline-flex; align-items: center; padding: 8px 12px; background-color: #34A853; color: white; border: none; border-radius: 4px; font-size: 0.9em; font-weight: 500; cursor: pointer;">
                    <span style="margin-right: 5px;">🗓️</span> Download 2026 Schedule
                </button>
            </div>`;

        } else {
            html += `<div class="error">Could not determine next pickup date.</div>`;
        }

        card.innerHTML = html;
        resultsDiv.appendChild(card);
    });
}

function getAllPickupDates(route, standardDayStr) {
    const dates = [];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const standardDayIdx = days.indexOf(standardDayStr);

    // Start from Jan 1 2026 to Dec 31 2026
    let currentMonday = new Date("2025-12-29T12:00:00");

    for (let i = 0; i < 54; i++) {
        const aRouteStart = new Date(A_ROUTE_START + "T12:00:00");
        const timeDiff = currentMonday.getTime() - aRouteStart.getTime();
        const weeksDiff = Math.round(timeDiff / (1000 * 3600 * 24 * 7));

        let currentWeekRoute = (weeksDiff % 2 === 0) ? "A" : "B";
        if (weeksDiff % 2 !== 0) currentWeekRoute = "B";

        if (currentWeekRoute === route) {
            let pickupDate = new Date(currentMonday);
            pickupDate.setDate(currentMonday.getDate() + (standardDayIdx - 1));

            // Check holidays
            let delay = 0;
            const weekEnd = new Date(currentMonday);
            weekEnd.setDate(currentMonday.getDate() + 6);

            for (let h of HOLIDAYS_2026) {
                const hDate = new Date(h.date + "T12:00:00");
                if (hDate >= currentMonday && hDate <= weekEnd) {
                    if (hDate.getDay() <= standardDayIdx && hDate.getDay() !== 0 && hDate.getDay() !== 6) {
                        delay = 1;
                    }
                }
            }

            pickupDate.setDate(pickupDate.getDate() + delay);

            // Only add if in 2026
            if (pickupDate.getFullYear() === 2026) {
                dates.push({
                    date: pickupDate,
                    isDelayed: delay > 0
                });
            }
        }
        currentMonday.setDate(currentMonday.getDate() + 7);
    }
    return dates;
}

function generateICS(pickupObjects, streetName, segment, route, standardDay) {
    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//University Heights//Recycling Schedule//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";

    const now = new Date();
    const stamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const streetDisplay = segment ? `${streetName} (${segment})` : streetName;

    pickupObjects.forEach(obj => {
        const date = obj.date;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateStr = `${y}${m}${d}`;

        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const ny = nextDay.getFullYear();
        const nm = String(nextDay.getMonth() + 1).padStart(2, '0');
        const nd = String(nextDay.getDate()).padStart(2, '0');
        const nextDayStr = `${ny}${nm}${nd}`;

        const scheduleType = obj.isDelayed ? "Delayed schedule" : "Regular schedule";

        let desc = `${streetDisplay}\\n`;
        desc += `Route ${route} • Regular Schedule: ${standardDay}\\n`;
        desc += `${scheduleType}\\n\\n`;
        desc += `Resources:\\n`;
        desc += `Recycling Routes PDF: https://www.universityheights.com/wp-content/uploads/2024/09/Recycling-Routes.pdf\\n`;
        desc += `2026 Schedule PDF: https://www.universityheights.com/wp-content/uploads/2025/11/2026-Recycling-Schedule.pdf\\n`;
        desc += `Service Department: https://www.universityheights.com/departments/service/#service|9\\n\\n`;
        desc += `Please check official city communications for changes.`;

        icsContent += "BEGIN:VEVENT\r\n";
        icsContent += `DTSTART;VALUE=DATE:${dateStr}\r\n`;
        icsContent += `DTEND;VALUE=DATE:${nextDayStr}\r\n`;
        icsContent += `DTSTAMP:${stamp}\r\n`;
        icsContent += `UID:${dateStr}-${streetName.replace(/\s+/g, '')}@universityheights.com\r\n`;
        icsContent += `SUMMARY:Recycling Pickup: ${streetName} Route ${route}\r\n`;
        icsContent += `DESCRIPTION:${desc}\r\n`;
        icsContent += "STATUS:CONFIRMED\r\n";
        icsContent += "END:VEVENT\r\n";
    });

    icsContent += "END:VCALENDAR";
    return icsContent;
}

function downloadFullSchedule(route, day, streetName, segment) {
    if (segment === 'undefined' || segment === 'null') segment = '';

    const pickupObjects = getAllPickupDates(route, day);
    const icsContent = generateICS(pickupObjects, streetName, segment, route, day);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${streetName}_${route}_Recycling_Schedule_2026.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initial display
const initialDate = getToday();
checkHolidayWeek(initialDate);

// Add event listener for Enter key
document.getElementById('streetInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        findSchedule();
    }
});

// Simulation Control
let simulationEnabled = false;

window.enableTesting = function() {
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
    query = query.toLowerCase().trim();
    return STREET_DATA.filter(s => s.name.toLowerCase().includes(query));
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
    currentMonday.setHours(12,0,0,0);

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
            qDateNorm.setHours(12,0,0,0);

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
    currentMonday.setHours(12,0,0,0);

    const weekEnd = new Date(currentMonday);
    weekEnd.setDate(currentMonday.getDate() + 6);

    let isHolidayWeek = false;
    for (let h of HOLIDAYS_2026) {
        const hDate = new Date(h.date + "T12:00:00");
        if (hDate >= currentMonday && hDate <= weekEnd) {
            if (hDate.getDay() >= 1 && hDate.getDay() <= 5) {
                isHolidayWeek = true;
                break;
            }
        }
    }

    if (isHolidayWeek) {
        alertBox.style.display = 'block';
    } else {
        alertBox.style.display = 'none';
    }
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
        } else {
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
document.getElementById('streetInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        findSchedule();
    }
});

// Helper to check if current environment is 2025 (testing mode)
function isTestingMode() {
    const now = new Date();
    return now.getFullYear() < 2026;
}

// Show simulation controls if in testing mode
if (isTestingMode()) {
    document.querySelector('.simulation-controls').style.display = 'block';
    const now = new Date();
    // Default sim date to today next year or Jan 1 2026
    document.getElementById('simDate').value = '2026-01-01';
}

function getToday() {
    if (isTestingMode()) {
        const simVal = document.getElementById('simDate').value;
        if (simVal) return new Date(simVal + "T12:00:00"); // Noon to avoid timezone issues
    }
    return new Date();
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
    // Start from the Monday of the current week
    let currentMonday = new Date(queryDate);
    const day = currentMonday.getDay();
    const diff = currentMonday.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    currentMonday.setDate(diff);
    currentMonday.setHours(12,0,0,0); // normalize time

    // Reference A Route Start: Jan 5 2026
    const aRouteStart = new Date(A_ROUTE_START + "T12:00:00");

    // Look ahead up to 4 weeks to find next pickup
    for (let i = 0; i < 4; i++) {
        // Determine if this week is A or B
        // Calculate weeks difference from reference
        const timeDiff = currentMonday.getTime() - aRouteStart.getTime();
        const weeksDiff = Math.round(timeDiff / (1000 * 3600 * 24 * 7));

        let currentWeekRoute = (weeksDiff % 2 === 0) ? "A" : "B";

        // If reference date is in future (e.g. query Jan 1 2026, Ref Jan 5), weeksDiff is negative
        // -1 % 2 = -1. We need positive modulus logic or just handle logic.
        // If weeksDiff is even (0, 2, -2), it's A. If odd (1, -1), it's B.
        if (weeksDiff % 2 !== 0) currentWeekRoute = "B";

        if (currentWeekRoute === route) {
            // This is the correct route week.
            // Calculate Standard Pickup Date
            // currentMonday is Monday. standardDayIdx is 1=Mon, 2=Tue...
            // Date = currentMonday + (standardDayIdx - 1) days
            let pickupDate = new Date(currentMonday);
            pickupDate.setDate(currentMonday.getDate() + (standardDayIdx - 1));

            // Check Holidays logic for this week
            // "City holidays will delay pickup by one day"
            // We assume this applies if holiday is on or before standard pickup day within the week?
            // Actually, usually delay applies to all days *after* the holiday too?
            // "City holidays will delay pickup by one day" usually means:
            // If holiday is Mon: Mon->Tue, Tue->Wed...
            // If holiday is Thu: Mon-Wed normal, Thu->Fri.

            let delay = 0;

            // Find holidays in this week (Mon-Fri)
            // Range: currentMonday to currentMonday+6
            const weekEnd = new Date(currentMonday);
            weekEnd.setDate(currentMonday.getDate() + 6);

            for (let h of HOLIDAYS_2026) {
                const hDate = new Date(h.date + "T12:00:00");
                if (hDate >= currentMonday && hDate <= weekEnd) {
                    // Holiday is in this week
                    // Does it affect pickup?
                    // If holiday is on the pickup day or before it (and it's a weekday holiday)
                    // hDate.getDay(): 1=Mon...
                    // standardDayIdx: 1=Mon...

                    // Actually, let's just check if hDate <= pickupDate (original)
                    // If holiday is Monday (1), and pickup is Tuesday (2). 1 <= 2. Delay.
                    // If holiday is Thursday (4), and pickup is Tuesday (2). 4 > 2. No Delay.
                    // Exception: Friday holiday usually doesn't affect Mon-Thu unless specified.
                    // But if delay happens, Friday might become Saturday.

                    if (hDate.getDay() <= standardDayIdx && hDate.getDay() !== 0 && hDate.getDay() !== 6) {
                         delay = 1;
                    }
                }
            }

            pickupDate.setDate(pickupDate.getDate() + delay);

            // Check if this date is in the past (before queryDate, ignoring time)
            // If query is Tuesday morning and pickup is Tuesday (today), we show it.
            // If query is Tuesday evening... we treat simple date comparison.
            // Let's normalize queryDate to noon
            const qDateNorm = new Date(queryDate);
            qDateNorm.setHours(12,0,0,0);

            if (pickupDate >= qDateNorm) {
                return pickupDate;
            }
        }

        // Move to next week
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

    // Find Monday of the current week
    let currentMonday = new Date(today);
    const day = currentMonday.getDay();
    const diff = currentMonday.getDate() - day + (day == 0 ? -6 : 1);
    currentMonday.setDate(diff);
    currentMonday.setHours(12,0,0,0);

    const weekEnd = new Date(currentMonday);
    weekEnd.setDate(currentMonday.getDate() + 6); // Sunday

    let isHolidayWeek = false;
    for (let h of HOLIDAYS_2026) {
        const hDate = new Date(h.date + "T12:00:00");
        // Check if holiday is in this week (Mon-Fri specifically affects schedule)
        if (hDate >= currentMonday && hDate <= weekEnd) {
            // Check if it's a weekday holiday (Mon=1 ... Fri=5)
            // Or if it simply exists in the week, it usually implies a holiday week.
            // The logic: "City holidays delay pickup by one day".
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

    checkHolidayWeek(today); // Check for global alert

    if (isTestingMode()) {
        document.getElementById('currentDateDisplay').innerText = "Simulated Today: " + formatDate(today);
    }

    resultsDiv.innerHTML = '';

    const matches = findStreet(input);

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="error">No street found matching "' + input + '". Please try again.</div>';
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
            const diffTime = Math.abs(nextDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let label = "Next Pickup:";
            if (diffDays <= 7 && nextDate.getDay() >= today.getDay()) {
               // roughly "this week"
            }

            // Check for delay
            const standardDay = match.day;
            const pickupDay = nextDate.toLocaleDateString('en-US', { weekday: 'long' });
            let delayHtml = "";
            if (standardDay !== pickupDay) {
                delayHtml = `<div class="delay-note">⚠️ Schedule adjusted for holiday</div>`;
            }

            html += `<div class="date-display">${label} ${formatDate(nextDate)}</div>`;
            html += delayHtml;
        } else {
            html += `<div class="error">Could not determine next pickup date.</div>`;
        }

        card.innerHTML = html;
        resultsDiv.appendChild(card);
    });
}

// Initial display for sim mode or startup
const initialDate = getToday();
checkHolidayWeek(initialDate);

if (isTestingMode()) {
    document.getElementById('currentDateDisplay').innerText = "Simulated Today: " + formatDate(initialDate);
}

// Add event listener for Enter key
document.getElementById('streetInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        findSchedule();
    }
});

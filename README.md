# Unofficial University Heights Rubbish & Recycling Schedule 2026 App

An unofficial web application that helps residents of University Heights find their next **rubbish and recycling pickup dates** for 2026.


## How to run the app locally

1.  Open `index.html` in your web browser (or run a local server, e.g. `python3 -m http.server 8000`).
2.  Enter your street name in the search box (e.g., "Cedar").
3.  Click "Find Schedule" or press **Enter**.
4.  The app will display:
    *   **Rubbish Pickup (Weekly)** — Your next rubbish pickup date.
    *   **Recycling Pickup (Route A/B Weeks)** — Your next recycling pickup date (every other week).
    *   Your Route (A or B), standard pickup day, and any holiday schedule adjustments.
    *   Links to add the next pickup to your Google Calendar.

## New Schedule (Effective June 1, 2026)

Starting June 1, 2026, the pickup schedule changed:

*   **Rubbish** — Picked up **every week** on your designated day.
*   **Recycling** — Picked up **every other week** on Route A or B weeks.
*   Route A weeks start the week of June 8; Route B weeks start the week of June 1.

## How It Works

*   The app is a static web page (`index.html`, `script.js`, `styles.css`, `data.js`). It runs entirely in your browser and does not require a backend server.
*   **Data**: Route information, street assignments, and the 2026 holiday calendar are hardcoded in `data.js` based on the official PDF documents provided by the city.
*   **Logic**:
    *   **Rubbish** is scheduled every week on the street's designated day (Monday, Tuesday, or Wednesday).
    *   **Recycling** follows the A/B cycle. January 5, 2026 is a reference A week. Even-numbered weeks from that date are A weeks, odd-numbered weeks are B weeks.
    *   For both rubbish and recycling, the app checks the 2026 holiday calendar. If a weekday holiday falls on or before your pickup day in the same week, the pickup is delayed by one day.

## Simulation Mode (Testing)

The application includes a hidden simulation mode to test dates in 2026 (useful if you are running the app before June 2026 or want to verify future schedules).

To enable it:

1.  Open your browser's **Developer Console** (usually F12 or Right Click -> Inspect -> Console).
2.  Type `enableTesting()` and press Enter.
3.  A "Date Simulation" panel will appear, allowing you to simulate "Today" as any date in 2026.

## Running a Local Server

The app works by opening `index.html` directly in a browser, but you can also serve it locally:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Data Sources

*   [2026 Rubbish Routes PDF](https://www.universityheights.com/wp-content/uploads/2026/Rubbish_Routes_2026_Updated_TOO.pdf)
*   [2026 Recycling Schedule PDF](https://www.universityheights.com/wp-content/uploads/2026/2026_Recycling_Schedule.pdf)
*   [Rubbish Pickup Schedule](https://universityheightsoh.gov/departments/service/#service|8)
*   [Recycling Pickup Schedule](https://universityheightsoh.gov/departments/service/#service|9)
*   [Service Department Website](https://universityheightsoh.gov/departments/service)

Extracted data is also available as markdown: [`rubbish_routes.md`](rubbish_routes.md) and [`recycling_schedule.md`](recycling_schedule.md).

## Disclaimer

This app is **unofficial** and for informational purposes only. Please refer to the official city website and communications for the most up-to-date information regarding waste management and schedule changes.

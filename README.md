# University Heights Recycling Schedule 2026 App

This is a simple web application that helps residents of University Heights find their recycling pickup schedule for the year 2026.

## How to Use

1.  Open `index.html` in your web browser.
2.  Enter your street name in the search box (e.g., "Cedar").
3.  Click "Find Schedule" or press **Enter**.
4.  The app will display:
    *   Your Route (A or B).
    *   Your standard pickup day.
    *   The date of your **next recycling pickup**.

## How It Works

*   The app is a static web page (`index.html`, `script.js`, `styles.css`, `data.js`). It runs entirely in your browser and does not require a backend server.
*   **Data**: The route information and holiday schedule are hardcoded in `data.js` based on the official PDF documents provided by the city.
*   **Logic**:
    *   It determines if the current week corresponds to Route A or Route B based on a reference date (Jan 5, 2026 is an A week).
    *   It calculates the pickup date for the current week.
    *   It checks against the 2026 holiday calendar. If a holiday falls on a weekday on or before your pickup day, the pickup is delayed by one day.

## Simulation Mode (Testing)

The application includes a hidden simulation mode to test dates in 2026 (useful if you are running the app in a previous year or want to verify future schedules).

To enable it:
1. Open your browser's **Developer Console** (usually F12 or Right Click -> Inspect -> Console).
2. Type `enableTesting()` and press Enter.
3. A "Date Simulation" panel will appear, allowing you to simulate "Today" as any date in 2026.

## Data Sources

*   [Recycling Routes PDF](https://www.universityheights.com/wp-content/uploads/2024/09/Recycling-Routes.pdf)
*   [2026 Recycling Schedule PDF](https://www.universityheights.com/wp-content/uploads/2025/11/2026-Recycling-Schedule.pdf)
*   [University Heights Service Department](https://www.universityheights.com/departments/service/#service|9)

## Disclaimer

This application is for informational purposes. Please refer to official city communications for the most up-to-date information regarding waste management and schedule changes.

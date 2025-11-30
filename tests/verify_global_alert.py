from playwright.sync_api import sync_playwright

def verify_global_alert():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        # Go to local file
        page.goto("http://localhost:8080/index.html")

        # Enable Testing Mode via Console
        page.evaluate("window.enableTesting()")

        # 1. Simulate a Normal Week (Jan 5, 2026 - no holiday this week)
        page.fill("#simDate", "2026-01-05")
        page.click("text=Update")

        # Check that alert is hidden
        alert = page.locator("#globalAlert")
        if not alert.is_visible():
            print("Success: Alert hidden for Normal Week.")
        else:
            print("Failure: Alert visible for Normal Week.")

        # 2. Simulate a Holiday Week (Jan 19, 2026 - MLK Day on Monday)
        page.fill("#simDate", "2026-01-19")
        page.click("text=Update")

        # Check that alert is visible
        if alert.is_visible():
            print("Success: Alert visible for Holiday Week.")
            page.screenshot(path="verify_global_alert_active.png")
            print("Screenshot saved to verify_global_alert_active.png")
        else:
            print("Failure: Alert hidden for Holiday Week.")

        browser.close()

if __name__ == "__main__":
    verify_global_alert()

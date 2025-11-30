from playwright.sync_api import sync_playwright, expect

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to local file
        page.goto("http://localhost:8080/index.html")

        # Verify simulation controls are hidden by default
        controls = page.locator(".simulation-controls")
        expect(controls).to_be_hidden()

        # Take a screenshot
        page.screenshot(path="verification/verification_hidden.png")
        print("Screenshot hidden mode saved.")

        # Enable testing mode
        page.evaluate("window.enableTesting()")

        # Verify simulation controls are visible
        expect(controls).to_be_visible()

        # Take a screenshot
        page.screenshot(path="verification/verification_visible.png")
        print("Screenshot visible mode saved.")

        browser.close()

if __name__ == "__main__":
    verify_changes()

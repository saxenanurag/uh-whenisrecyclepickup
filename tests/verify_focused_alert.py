from playwright.sync_api import sync_playwright

def verify_focused_alert():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        # Go to local file - assuming simple http server or file based
        # Used http://localhost:8080/index.html in previous test, let's assume server is needed or use absolute path?
        # The previous test used localhost:8080. If the user doesn't have it running, this might fail.
        # But per USER_RULES, I can't start a server myself easily unless I background it.
        # However, the previous test view showed "http://localhost:8080/index.html".
        # Let's try to assume the user might have it running, OR use file:// path.
        # But easier approach is to use `python3 -m http.server 8080` in background?
        # Actually, let's just stick to what the previous test did.

        page.goto("http://localhost:8085/index.html")

        # Enable Testing Mode via Console
        page.evaluate("window.enableTesting()")

        print("--- Test 1: Monday Holiday (MLK Day) ---")
        page.fill("#simDate", "2026-01-19")
        page.click("text=Update")

        alert = page.locator("#globalAlert")
        if alert.is_visible():
            text = alert.inner_text()
            print(f"Alert Text: {text}")
            if "Pickup will be delayed by a day." in text and "on or after" not in text:
                print("PASS: Correct text for Monday holiday.")
            else:
                print("FAIL: Incorrect text for Monday holiday.")
        else:
            print("FAIL: Alert not visible.")

        print("\n--- Test 2: Midweek Holiday (Veterans Day - Wed) ---")
        page.fill("#simDate", "2026-11-11")
        page.click("text=Update")

        if alert.is_visible():
            text = alert.inner_text()
            print(f"Alert Text: {text}")
            if "delayed by a day for routes on or after Wednesday" in text:
                 print("PASS: Correct text for Wednesday holiday.")
            else:
                 print("FAIL: Incorrect text for Wednesday holiday.")
        else:
            print("FAIL: Alert not visible.")

        print("\n--- Test 3: Normal Week ---")
        page.fill("#simDate", "2026-01-05")
        page.click("text=Update")

        if not alert.is_visible():
            print("PASS: Alert hidden.")
        else:
            print("FAIL: Alert visible.")

        browser.close()

if __name__ == "__main__":
    verify_focused_alert()

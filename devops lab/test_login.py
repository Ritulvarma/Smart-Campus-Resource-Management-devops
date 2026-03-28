"""
Selenium test for Smart Campus RMS Login
This test creates a new user via signup and then tests login
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import random
import string

print("Starting Selenium Test...")

# Generate random test user
def generate_random_email():
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"testuser_{random_string}@example.com"

TEST_EMAIL = generate_random_email()
TEST_PASSWORD = "TestPassword123!"

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# Initialize driver
driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=chrome_options
)

try:
    # ========== STEP 1: SIGNUP ==========
    print("\n=== STEP 1: Creating new user via Signup ===")
    print(f"Test Email: {TEST_EMAIL}")
    print(f"Test Password: {TEST_PASSWORD}")
    
    driver.get("http://localhost:3000/signup.html")
    time.sleep(3)
    
    print(f"Current URL: {driver.current_url}")
    print(f"Page Title: {driver.title}")
    
    # Fill signup form
    driver.find_element(By.ID, "name").send_keys("Test User")
    driver.find_element(By.ID, "email").send_keys(TEST_EMAIL)
    driver.find_element(By.ID, "password").send_keys(TEST_PASSWORD)
    
    print("Signup form filled")
    
    # Click signup button
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    print("Signup button clicked")
    
    # Wait for signup to complete
    time.sleep(3)
    
    # Check if signup was successful (should redirect)
    current_url = driver.current_url
    print(f"URL after signup: {current_url}")
    
    if "signup" in current_url.lower():
        # Check for alert (user might already exist)
        try:
            alert = driver.switch_to.alert
            print(f"Alert: {alert.text}")
            alert.accept()
            print("Signup might have failed - user already exists")
        except:
            pass
    
    print("=== Signup completed ===\n")
    
    # ========== STEP 2: LOGIN TEST ==========
    print("=== STEP 2: Testing Login ===")
    
    # Go to login page
    driver.get("http://localhost:3000/signin.html")
    time.sleep(3)
    
    print(f"Current URL: {driver.current_url}")
    print(f"Page Title: {driver.title}")
    
    # Find and fill login form
    email_field = driver.find_element(By.ID, "email")
    print(f"Email field found: {email_field.is_displayed()}")
    
    # Use the same credentials from signup
    email_field.send_keys(TEST_EMAIL)
    print(f"Email entered: {TEST_EMAIL}")
    
    password_field = driver.find_element(By.ID, "password")
    password_field.send_keys(TEST_PASSWORD)
    print("Password entered")
    
    # Click login button
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    print("Login button clicked")
    
    # Wait for login to process
    time.sleep(3)
    
    # Check for alert
    try:
        alert = driver.switch_to.alert
        alert_text = alert.text
        print(f"Alert appeared: {alert_text}")
        alert.accept()
        print("TEST FAILED - Invalid credentials!")
    except:
        # No alert - check URL
        current_url = driver.current_url
        print(f"Current URL after login: {current_url}")
        
        # Validation
        if "index.html" in current_url or current_url == "http://localhost:3000/" or current_url.endswith("3000/"):
            print("\n" + "="*50)
            print("TEST PASSED - Login successful!")
            print("="*50)
        else:
            print("\n" + "="*50)
            print("TEST FAILED - Login failed")
            print("="*50)

except Exception as e:
    print(f"\nTEST FAILED - Exception: {e}")
    import traceback
    traceback.print_exc()

finally:
    print("\nClosing browser...")
    driver.quit()


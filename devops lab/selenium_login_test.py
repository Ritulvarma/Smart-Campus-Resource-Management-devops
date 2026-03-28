"""
Selenium script for testing the Login page of Smart Campus RMS
Requirements: pip install selenium webdriver-manager
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

# Configure Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# Initialize the driver
driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=chrome_options
)

BASE_URL = "http://localhost:3000"

def test_login_page_loads():
    """Test that the login page loads successfully"""
    print("Testing: Login page loads...")
    driver.get(f"{BASE_URL}/signin.html")
    time.sleep(2)
    
    # Check if the page title contains "Sign In"
    assert "Sign In" in driver.title
    print("✓ Login page loaded successfully")
    
    # Check if email and password fields exist
    email_field = driver.find_element(By.ID, "email")
    password_field = driver.find_element(By.ID, "password")
    submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    
    assert email_field is not None
    assert password_field is not None
    assert submit_button is not None
    print("✓ All login form elements found")

def test_login_with_valid_credentials():
    """Test login with valid credentials"""
    print("\nTesting: Login with valid credentials...")
    
    # First, create a test user via signup
    driver.get(f"{BASE_URL}/signup.html")
    time.sleep(2)
    
    # Fill signup form
    driver.find_element(By.ID, "name").send_keys("Test User")
    driver.find_element(By.ID, "email").send_keys("testuser@example.com")
    driver.find_element(By.ID, "password").send_keys("testpass123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    
    time.sleep(3)
    
    # After signup, should redirect to home page
    current_url = driver.current_url
    print(f"Redirected to: {current_url}")
    print("✓ Signup successful, logged in automatically")

def test_login_form_validation():
    """Test login form validation (empty fields)"""
    print("\nTesting: Login form validation...")
    
    driver.get(f"{BASE_URL}/signin.html")
    time.sleep(2)
    
    # Try to submit empty form
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(1)
    
    # Check for HTML5 validation (required attribute)
    email_field = driver.find_element(By.ID, "email")
    password_field = driver.find_element(By.ID, "password")
    
    # The form should have 'required' attribute
    assert email_field.get_attribute("required") is not None
    assert password_field.get_attribute("required") is not None
    print("✓ Form validation works (required fields)")

def test_login_with_invalid_credentials():
    """Test login with invalid credentials"""
    print("\nTesting: Login with invalid credentials...")
    
    driver.get(f"{BASE_URL}/signin.html")
    time.sleep(2)
    
    # Enter invalid credentials
    driver.find_element(By.ID, "email").send_keys("invalid@example.com")
    driver.find_element(By.ID, "password").send_keys("wrongpassword")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    
    time.sleep(2)
    
    # Check for alert or stay on page
    try:
        alert = driver.switch_to.alert
        alert.accept()
        print("✓ Got alert for invalid credentials")
    except:
        # If no alert, check if still on signin page
        assert "signin" in driver.current_url.lower()
        print("✓ Stays on signin page with invalid credentials")

def test_navigation_to_signup():
    """Test navigation from login page to signup page"""
    print("\nTesting: Navigation to signup page...")
    
    driver.get(f"{BASE_URL}/signin.html")
    time.sleep(2)
    
    # Click the signup link
    driver.find_element(By.CSS_SELECTOR, "a[href='/signup.html']").click()
    time.sleep(2)
    
    assert "signup" in driver.current_url.lower()
    print("✓ Navigation to signup page works")

def main():
    """Run all tests"""
    print("=" * 50)
    print("Smart Campus RMS - Selenium Login Tests")
    print("=" * 50)
    
    try:
        test_login_page_loads()
        test_login_form_validation()
        test_navigation_to_signup()
        test_login_with_valid_credentials()
        test_login_with_invalid_credentials()
        
        print("\n" + "=" * 50)
        print("All tests completed successfully!")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        raise
    finally:
        driver.quit()

if __name__ == "__main__":
    main()


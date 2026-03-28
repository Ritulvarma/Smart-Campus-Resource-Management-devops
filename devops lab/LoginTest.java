import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class LoginTest {

    public static void main(String[] args) {
        System.out.println("Starting Selenium Test...");
        
        // 1. Set path of ChromeDriver
        System.setProperty("webdriver.chrome.driver",
                "C:\\Users\\RITUL\\OneDrive\\Desktop\\chromedriver.exe");

        // 2. Configure Chrome options
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-extensions");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        
        // 3. Launch browser with options
        WebDriver driver = new ChromeDriver(options);

        try {
            System.out.println("Opening website: http://localhost:3000/signin.html");
            
            // 4. Navigate to login page
            driver.get("http://localhost:3000/signin.html");

            // Wait for page to load
            Thread.sleep(3000);
            
            // Print current URL and title
            System.out.println("Current URL: " + driver.getCurrentUrl());
            System.out.println("Page Title: " + driver.getTitle());

            // 5. Find and print email field
            var emailField = driver.findElement(By.id("email"));
            System.out.println("Email field found: " + emailField.isDisplayed());
            
            // 6. Enter email
            emailField.sendKeys("ritul.verma.btech2023@sitnagpur.siu.edu.in");
            System.out.println("Email entered");

            // 7. Enter password - CHANGE THIS TO YOUR ACTUAL PASSWORD
            driver.findElement(By.id("password")).sendKeys("YOUR_PASSWORD_HERE");
            System.out.println("Password entered");

            // 8. Click login button
            driver.findElement(By.cssSelector("button[type='submit']")).click();
            System.out.println("Login button clicked");

            // 9. Wait for page to load after login
            Thread.sleep(3000);

            // 10. Get current URL
            String currentUrl = driver.getCurrentUrl();
            System.out.println("Current URL after login: " + currentUrl);

            // 11. Validation
            if (currentUrl.contains("index.html") || currentUrl.equals("http://localhost:3000/") || currentUrl.endsWith("3000/")) {
                System.out.println("TEST PASSED - Login successful!");
            } else {
                System.out.println("TEST FAILED - Login failed, still on: " + currentUrl);
            }

        } catch (Exception e) {
            System.out.println("TEST FAILED - Exception: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // 12. Close browser
            System.out.println("Closing browser...");
            driver.quit();
        }
    }
}


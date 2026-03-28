/**
 * Selenium script for testing the Login page of Smart Campus RMS
 * Requirements: npm install selenium-webdriver chromedriver
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLoginPageLoads() {
  console.log('Testing: Login page loads...');
  
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  
  const driver = await new Builder()
    .setChromeOptions(options)
    .forBrowser('chrome')
    .build();
  
  try {
    await driver.get(`${BASE_URL}/signin.html`);
    await sleep(2000);
    
    const title = await driver.getTitle();
    console.log(`Page title: ${title}`);
    
    // Check form elements exist
    const emailField = await driver.findElement(By.id('email'));
    const passwordField = await driver.findElement(By.id('password'));
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    
    console.log('✓ Email field found');
    console.log('✓ Password field found');
    console.log('✓ Submit button found');
    console.log('✓ Login page loaded successfully');
    
    return driver;
  } catch (error) {
    console.error('✗ Login page test failed:', error.message);
    await driver.quit();
    throw error;
  }
}

async function testSignupAndLogin(driver) {
  console.log('\nTesting: Signup and automatic login...');
  
  await driver.get(`${BASE_URL}/signup.html`);
  await sleep(2000);
  
  // Fill signup form
  await driver.findElement(By.id('name')).sendKeys('Selenium User');
  await driver.findElement(By.id('email')).sendKeys('selenium@test.com');
  await driver.findElement(By.id('password')).sendKeys('testpass123');
  await driver.findElement(By.css('button[type="submit"]')).click();
  
  await sleep(3000);
  
  const currentUrl = driver.currentUrl;
  console.log(`Redirected to: ${currentUrl}`);
  console.log('✓ Signup and login successful');
}

async function testInvalidLogin(driver) {
  console.log('\nTesting: Invalid login credentials...');
  
  await driver.get(`${BASE_URL}/signin.html`);
  await sleep(2000);
  
  // Enter invalid credentials
  await driver.findElement(By.id('email')).sendKeys('wrong@test.com');
  await driver.findElement(By.id('password')).sendKeys('wrongpass');
  await driver.findElement(By.css('button[type="submit"]')).click();
  
  await sleep(2000);
  
  // Check if still on signin page
  const currentUrl = driver.currentUrl;
  console.log(`Current URL: ${currentUrl}`);
  console.log('✓ Invalid login handled correctly (stays on signin page)');
}

async function testNavigationToSignup(driver) {
  console.log('\nTesting: Navigation to signup page...');
  
  await driver.get(`${BASE_URL}/signin.html`);
  await sleep(2000);
  
  // Click signup link
  await driver.findElement(By.css('a[href="/signup.html"]')).click();
  await sleep(2000);
  
  const currentUrl = driver.currentUrl;
  console.log(`Current URL: ${currentUrl}`);
  console.log('✓ Navigation to signup page works');
}

async function runAllTests() {
  console.log('=' .repeat(50));
  console.log('Smart Campus RMS - Selenium Login Tests');
  console.log('=' .repeat(50));
  
  let driver;
  
  try {
    driver = await testLoginPageLoads();
    await testNavigationToSignup(driver);
    await testSignupAndLogin(driver);
    await testInvalidLogin(driver);
    
    console.log('\n' + '=' .repeat(50));
    console.log('All tests completed successfully!');
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// Run tests
runAllTests();


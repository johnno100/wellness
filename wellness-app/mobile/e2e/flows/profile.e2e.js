describe('Profile and Connections Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    
    // Login before testing profile
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.text('Login')).tap();
    
    // Wait for dashboard to load
    await expect(element(by.text('Wellness Score'))).toBeVisible();
  });

  beforeEach(async () => {
    // Navigate to profile screen
    await element(by.text('Profile')).tap();
  });

  it('should display user profile information', async () => {
    await expect(element(by.text('Profile'))).toBeVisible();
    await expect(element(by.id('name-input'))).toHaveText('Test User');
    await expect(element(by.id('email-input'))).toHaveText('test@example.com');
    await expect(element(by.text('Manage API Connections'))).toBeVisible();
    await expect(element(by.text('Logout'))).toBeVisible();
  });

  it('should update user profile information', async () => {
    // Clear and update name
    await element(by.id('name-input')).clearText();
    await element(by.id('name-input')).typeText('Updated User');
    
    // Save changes
    await element(by.text('Save Changes')).tap();
    
    // Wait for success message
    await expect(element(by.text('Profile updated successfully'))).toBeVisible();
    
    // Verify updated name persists
    await expect(element(by.id('name-input'))).toHaveText('Updated User');
  });

  it('should navigate to connections screen', async () => {
    await element(by.text('Manage API Connections')).tap();
    
    // Verify connections screen
    await expect(element(by.text('API Connections'))).toBeVisible();
    await expect(element(by.text('Sahha.ai'))).toBeVisible();
    await expect(element(by.text('Asleep.ai'))).toBeVisible();
    await expect(element(by.text('Passio.ai'))).toBeVisible();
    await expect(element(by.text('Strava'))).toBeVisible();
  });

  it('should connect and disconnect APIs', async () => {
    // Navigate to connections screen if not already there
    if (!(await element(by.text('API Connections')).isVisible())) {
      await element(by.text('Manage API Connections')).tap();
    }
    
    // Find a disconnected API (assuming Strava is disconnected)
    if (await element(by.id('strava-connect-button')).isVisible()) {
      // Connect to Strava
      await element(by.id('strava-connect-button')).tap();
      
      // Wait for connection process
      await expect(element(by.text('Connecting...'))).toBeVisible();
      await waitFor(element(by.text('Connected'))).toBeVisible().withTimeout(5000);
      
      // Disconnect from Strava
      await element(by.id('strava-disconnect-button')).tap();
      
      // Confirm disconnection
      await element(by.text('Yes')).tap();
      
      // Verify disconnected
      await expect(element(by.id('strava-connect-button'))).toBeVisible();
    } else {
      // If already connected, disconnect
      await element(by.id('strava-disconnect-button')).tap();
      
      // Confirm disconnection
      await element(by.text('Yes')).tap();
      
      // Verify disconnected
      await expect(element(by.id('strava-connect-button'))).toBeVisible();
      
      // Reconnect
      await element(by.id('strava-connect-button')).tap();
      
      // Wait for connection process
      await expect(element(by.text('Connecting...'))).toBeVisible();
      await waitFor(element(by.text('Connected'))).toBeVisible().withTimeout(5000);
    }
    
    // Navigate back to profile
    await element(by.id('back-button')).tap();
  });

  it('should logout user', async () => {
    await element(by.text('Logout')).tap();
    
    // Confirm logout
    await element(by.text('Yes')).tap();
    
    // Verify returned to login screen
    await expect(element(by.text('Login'))).toBeVisible();
  });
});

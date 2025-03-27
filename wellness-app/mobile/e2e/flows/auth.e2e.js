describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen', async () => {
    await expect(element(by.text('Login'))).toBeVisible();
    await expect(element(by.text('Don\'t have an account? Register'))).toBeVisible();
  });

  it('should show validation errors for empty fields', async () => {
    await element(by.text('Login')).tap();
    await expect(element(by.text('Email is required'))).toBeVisible();
    await expect(element(by.text('Password is required'))).toBeVisible();
  });

  it('should navigate to register screen', async () => {
    await element(by.text('Don\'t have an account? Register')).tap();
    await expect(element(by.text('Register'))).toBeVisible();
    await expect(element(by.text('Already have an account? Login'))).toBeVisible();
  });

  it('should register a new user', async () => {
    await element(by.text('Don\'t have an account? Register')).tap();
    
    // Fill in registration form
    await element(by.id('name-input')).typeText('Test User');
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('confirm-password-input')).typeText('password123');
    
    // Submit form
    await element(by.text('Register')).tap();
    
    // Should navigate to dashboard after successful registration
    await expect(element(by.text('Wellness Score'))).toBeVisible();
  });

  it('should login with existing credentials', async () => {
    // Ensure we're on the login screen
    await expect(element(by.text('Login'))).toBeVisible();
    
    // Fill in login form
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    
    // Submit form
    await element(by.text('Login')).tap();
    
    // Should navigate to dashboard after successful login
    await expect(element(by.text('Wellness Score'))).toBeVisible();
  });
});

describe('Dashboard Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    
    // Login before testing dashboard
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.text('Login')).tap();
    
    // Wait for dashboard to load
    await expect(element(by.text('Wellness Score'))).toBeVisible();
  });

  beforeEach(async () => {
    // Ensure we're on the dashboard screen
    await element(by.text('Dashboard')).tap();
  });

  it('should display wellness score and health cards', async () => {
    await expect(element(by.id('wellness-score'))).toBeVisible();
    await expect(element(by.id('mental-health-card'))).toBeVisible();
    await expect(element(by.id('sleep-card'))).toBeVisible();
    await expect(element(by.id('nutrition-card'))).toBeVisible();
    await expect(element(by.id('fitness-card'))).toBeVisible();
  });

  it('should navigate to mental health detail screen', async () => {
    await element(by.id('mental-health-card')).tap();
    await expect(element(by.text('Mental Health'))).toBeVisible();
    await expect(element(by.text('Mood Trends'))).toBeVisible();
    
    // Navigate back to dashboard
    await element(by.id('back-button')).tap();
  });

  it('should navigate to sleep detail screen', async () => {
    await element(by.id('sleep-card')).tap();
    await expect(element(by.text('Sleep'))).toBeVisible();
    await expect(element(by.text('Sleep Quality'))).toBeVisible();
    
    // Navigate back to dashboard
    await element(by.id('back-button')).tap();
  });

  it('should navigate to nutrition detail screen', async () => {
    await element(by.id('nutrition-card')).tap();
    await expect(element(by.text('Nutrition'))).toBeVisible();
    await expect(element(by.text('Calorie Intake'))).toBeVisible();
    
    // Navigate back to dashboard
    await element(by.id('back-button')).tap();
  });

  it('should navigate to fitness detail screen', async () => {
    await element(by.id('fitness-card')).tap();
    await expect(element(by.text('Fitness'))).toBeVisible();
    await expect(element(by.text('Activity Summary'))).toBeVisible();
    
    // Navigate back to dashboard
    await element(by.id('back-button')).tap();
  });

  it('should refresh dashboard data on pull-to-refresh', async () => {
    await element(by.id('dashboard-scroll-view')).swipe('down', 'slow', 0.5);
    await expect(element(by.id('refresh-indicator'))).toBeVisible();
    
    // Wait for refresh to complete
    await waitFor(element(by.id('refresh-indicator'))).toBeNotVisible().withTimeout(5000);
    
    // Verify data is still visible
    await expect(element(by.id('wellness-score'))).toBeVisible();
  });
});

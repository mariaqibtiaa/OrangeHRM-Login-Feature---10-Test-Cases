describe('OrangeHRM Login Feature with intercept', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/*.css', { log: false }); 

    cy.request({
      url: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
      failOnStatusCode: false 
    }).then((response) => {
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
        failOnStatusCode: false
      });
    });

    cy.on('uncaught:exception', () => false);
    cy.get('body', { timeout: 60000 }).should('exist');
    cy.get('input[name="username"]', { timeout: 40000 }).should('be.visible');
  });


  it('TC-01: Login successfully with valid credentials', () => {

    cy.intercept('GET', '**/dashboard/employees/action-summary').as('dashboardAPI');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@dashboardAPI'); 

    cy.get('.oxd-topbar-header-breadcrumb', { timeout: 10000 }).should('contain', 'Dashboard');
  });

  it('TC-02: Show error with valid Username and invalid Password', () => {

    cy.intercept('POST', '**/auth/validate').as('loginValidate');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('123456789');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginValidate');

    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

    it('TC-03: Show error with invalid Username and valid Password', () => {

    cy.intercept('GET', '**/core/i18n/messages').as('i18nMessages');

    cy.get('input[name="username"]').type('User');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@i18nMessages');

    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

    it('TC-04: Show error with both invalid Username and Password', () => {
    cy.get('input[name="username"]').type('User');
    cy.get('input[name="password"]').type('user123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  it('TC-05: Validation message when Username is empty', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group:has(input[name="username"]) .oxd-input-field-error-message')
      .should('have.text', 'Required');
  });

  it('TC-06: Validation message when Password is empty', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group:has(input[name="password"]) .oxd-input-field-error-message')
      .should('have.text', 'Required');
  });

  it('TC-07: Validation message when both fields are empty', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-field-error-message').should('have.length', 2);
  });

  it('TC-08: Fail login with correct password but wrong casing (Case Sensitivity)', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('ADMIN123'); 
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  it('TC-09: Navigate to Forgot Password page', () => {

    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('forgotPage');

    cy.contains('Forgot your password?').click();
    
    cy.wait('@forgotPage');

    cy.url().should('include', 'requestPasswordResetCode');
    cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
  });
    it('TC-10: Verify LinkedIn Icon is visible and has correct link', () => {
    cy.intercept('GET', '**/*.svg').as('svgIcons');
    
    cy.get('.orangehrm-login-footer-sm').scrollIntoView();

    cy.get('a[href*="linkedin"]').should('be.visible'); 
    cy.get('a[href*="linkedin"]').should('have.attr', 'href').and('include', 'linkedin.com');
  });

});

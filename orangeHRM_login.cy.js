describe('OrangeHRM Login Feature - 10 test case', () => {

  beforeEach(() => {
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

  // TC-01: Login Sukses
  it('TC-01: Login successfully with valid credentials', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-topbar-header-breadcrumb', { timeout: 10000 }).should('contain', 'Dashboard');
  });

  // TC-02: User Valid, Pass Salah 
  it('TC-02: Show error with valid Username and invalid Password', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('123456789');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  // TC-03: User Salah, Pass Valid
  it('TC-03: Show error with invalid Username and valid Password', () => {
    cy.get('input[name="username"]').type('User');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  // TC-04: User Salah, Pass Salah
  it('TC-04: Show error with both invalid Username and Password', () => {
    cy.get('input[name="username"]').type('User');
    cy.get('input[name="password"]').type('user123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  // TC-05: User Kosong, Pass Diisi
  it('TC-05: Validation message when Username is empty', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    // Ngecek pesan "Required" muncul di bawah field username
    cy.get('.oxd-input-group:has(input[name="username"]) .oxd-input-field-error-message')
      .should('have.text', 'Required');
  });

  // TC-06: User Diisi, Pass Kosong
  it('TC-06: Validation message when Password is empty', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();
    // Ngecek pesan "Required" muncul di bawah field password
    cy.get('.oxd-input-group:has(input[name="password"]) .oxd-input-field-error-message')
      .should('have.text', 'Required');
  });

  // TC-07: Dua-duanya Kosong
  it('TC-07: Validation message when both fields are empty', () => {
    cy.get('button[type="submit"]').click();
    // Harus muncul 2 pesan error "Required"
    cy.get('.oxd-input-field-error-message').should('have.length', 2);
  });

  // TC-08: Case Sensitivity Check (Password Huruf Besar Semua)
  it('TC-08: Fail login with correct password but wrong casing (Case Sensitivity)', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('ADMIN123'); // Harusnya admin123
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  // TC-09: Cek Fungsi Link Forgot Password
  it('TC-09: Navigate to Forgot Password page', () => {
    cy.contains('Forgot your password?').click();
    // Validasi URL berubah atau ada teks Reset Password
    cy.url().should('include', 'requestPasswordResetCode');
    cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
  });

// TC-10: Verifikasi Link Social Media (LinkedIn)
  it('TC-10: Verify LinkedIn Icon is visible and has correct link', () => {
    // Cek apakah ikon LinkedIn muncul
    cy.get('a[href*="linkedin"]').should('be.visible'); 
    
    // Cek apakah link-nya beneran mengarah ke LinkedIn, bukan link mati
    cy.get('a[href*="linkedin"]').should('have.attr', 'href').and('include', 'linkedin.com');
  });


});

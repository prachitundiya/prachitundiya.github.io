// ===========================================
// DOM ELEMENTS
// ===========================================
const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');
const homePage = document.getElementById('home-page');
const dashboardPage = document.getElementById('dashboard-page');
const feedbackPage = document.getElementById('feedback-page');
const visitSchoolPage = document.getElementById('visit-school-page');
const selectStandardPage = document.getElementById('select-standard-page');
const detailsDocumentsPage = document.getElementById('details-documents-page');
const paymentPage = document.getElementById('payment-page');
const paymentConfirmationPage = document.getElementById('payment-confirmation-page');

// Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const feedbackForm = document.getElementById('feedback-form');
const visitForm = document.getElementById('visit-form');
const standardForm = document.getElementById('standard-form');
const detailsForm = document.getElementById('details-form');
const paymentForm = document.getElementById('payment-form');

// Buttons
const toggleToRegister = document.getElementById('toggle-to-register');
const toggleToLogin = document.getElementById('toggle-to-login');
const logoutBtn = document.getElementById('logout-btn');
const dashboardBtn = document.getElementById('dashboard-btn');
const visitSchoolBtn = document.getElementById('visit-school-btn');
const selectStandardBtn = document.getElementById('select-standard-btn');
const dashboardBackBtn = document.getElementById('dashboard-back-btn');
const feedbackBackBtn = document.getElementById('feedback-back-btn');
const visitSchoolBackBtn = document.getElementById('visit-school-back');
const standardBackBtn = document.getElementById('standard-back');
const detailsBackBtn = document.getElementById('details-back');
const paymentBackBtn = document.getElementById('payment-back');
const confirmationBackBtn = document.getElementById('confirmation-back');
const confirmationHomeBtn = document.getElementById('confirmation-home');
const dashboardNextBtn = document.getElementById('dashboard-next');

// User info
const userName = document.getElementById('user-name');
const dashName = document.getElementById('dash-name');
const dashEmail = document.getElementById('dash-email');

// Payment
const paymentStandard = document.getElementById('payment-standard');
const confStandard = document.getElementById('conf-standard');
const confMethod = document.getElementById('conf-method');
const confTransaction = document.getElementById('conf-transaction');

// ===========================================
// PAGE NAVIGATION
// ===========================================
function showPage(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.add('hidden');
  });
  
  // Show the requested page
  page.classList.remove('hidden');
}

// ===========================================
// AUTHENTICATION
// ===========================================
// Toggle between login and register
toggleToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(registerPage);
});

toggleToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(loginPage);
});

// Login form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Simple validation
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  
  // Check if user exists and password matches
  if (userData.email === email && userData.password === password) {
    // Store logged in user
    localStorage.setItem('currentUser', JSON.stringify({
      name: userData.name,
      email: userData.email
    }));
    
    // Update UI
    userName.textContent = userData.name;
    dashName.textContent = userData.name;
    dashEmail.textContent = userData.email;
    
    // Show home page
    showPage(homePage);
  } else {
    alert('Invalid email or password');
  }
});

// Register form
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  
  // Validation
  if (!name || !email || !password || !confirmPassword) {
    alert('Please fill in all fields');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }
  
  // Save user data
  const userData = {
    name: name,
    email: email,
    password: password
  };
  
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // Store as current user
  localStorage.setItem('currentUser', JSON.stringify({
    name: name,
    email: email
  }));
  
  // Update UI
  userName.textContent = name;
  dashName.textContent = name;
  dashEmail.textContent = email;
  
  // Show home page
  showPage(homePage);
});

// Logout
logoutBtn.addEventListener('click', () => {
  // Clear current user
  localStorage.removeItem('currentUser');
  
  // Reset forms
  loginForm.reset();
  registerForm.reset();
  
  // Show login page
  showPage(loginPage);
});

// ===========================================
// NAVIGATION BUTTONS
// ===========================================
// Home page navigation
dashboardBtn.addEventListener('click', () => {
  showPage(dashboardPage);
});

visitSchoolBtn.addEventListener('click', () => {
  showPage(visitSchoolPage);
});

selectStandardBtn.addEventListener('click', () => {
  showPage(selectStandardPage);
});

// Back buttons
dashboardBackBtn.addEventListener('click', () => {
  showPage(homePage);
});

feedbackBackBtn.addEventListener('click', () => {
  showPage(dashboardPage);
});

// FIXED: Visit school back button
visitSchoolBackBtn.addEventListener('click', () => {
  showPage(homePage);
});

standardBackBtn.addEventListener('click', () => {
  showPage(homePage);
});

detailsBackBtn.addEventListener('click', () => {
  showPage(selectStandardPage);
});

paymentBackBtn.addEventListener('click', () => {
  showPage(detailsDocumentsPage);
});

confirmationBackBtn.addEventListener('click', () => {
  showPage(homePage);
});

confirmationHomeBtn.addEventListener('click', () => {
  showPage(homePage);
});

dashboardNextBtn.addEventListener('click', () => {
  showPage(feedbackPage);
});

// ===========================================
// FORM HANDLING
// ===========================================
// Feedback form
feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('feedback-email').value;
  const summary = document.getElementById('feedback-summary').value;
  
  if (!email || !summary) {
    alert('Please fill in all fields');
    return;
  }
  
  // Store feedback (in a real app, this would be sent to a server)
  const feedback = {
    email: email,
    summary: summary,
    timestamp: new Date().toISOString()
  };
  
  // Save to localStorage
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  feedbacks.push(feedback);
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  
  alert('Thank you for your feedback!');
  feedbackForm.reset();
  showPage(dashboardPage);
});

// Visit form
visitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('visitor-name').value;
  const email = document.getElementById('visitor-email').value;
  const date = document.getElementById('visit-date').value;
  const time = document.getElementById('visit-time').value;
  const purpose = document.getElementById('visit-purpose').value;
  
  if (!name || !email || !date || !time) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Store visit request
  const visitRequest = {
    name: name,
    email: email,
    date: date,
    time: time,
    purpose: purpose,
    timestamp: new Date().toISOString()
  };
  
  // Save to localStorage
  const visits = JSON.parse(localStorage.getItem('visits')) || [];
  visits.push(visitRequest);
  localStorage.setItem('visits', JSON.stringify(visits));
  
  alert('Your visit request has been submitted! We will contact you soon.');
  visitForm.reset();
  showPage(homePage);
});

// Standard selection
standardForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const standard = document.getElementById('standard-select').value;
  
  if (!standard) {
    alert('Please select a standard');
    return;
  }
  
  // Store selected standard
  localStorage.setItem('selectedStandard', standard);
  
  // Update payment page
  paymentStandard.textContent = `Standard ${standard}`;
  
  showPage(detailsDocumentsPage);
});

// Student details form
detailsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // In a real app, you would validate all fields and handle file uploads
  // For this demo, we'll just proceed to payment
  
  showPage(paymentPage);
});

// Payment form
paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const paymentMethod = document.getElementById('payment-method').value;
  
  if (!paymentMethod) {
    alert('Please select a payment method');
    return;
  }
  
  // Update confirmation page
  const standard = localStorage.getItem('selectedStandard') || 'N/A';
  confStandard.textContent = `Standard ${standard}`;
  confMethod.textContent = paymentMethod;
  
  // Generate a fake transaction ID
  const transactionId = 'TXN' + Date.now();
  confTransaction.textContent = transactionId;
  
  showPage(paymentConfirmationPage);
});

// Payment method selection
document.querySelectorAll('.payment-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove selected class from all buttons
    document.querySelectorAll('.payment-btn').forEach(b => {
      b.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    this.classList.add('selected');
    
    // Update hidden input
    document.getElementById('payment-method').value = this.getAttribute('data-method');
  });
});

// ===========================================
// INITIALIZATION
// ===========================================
// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (currentUser) {
    // User is logged in
    userName.textContent = currentUser.name;
    dashName.textContent = currentUser.name;
    dashEmail.textContent = currentUser.email;
    showPage(homePage);
  } else {
    // User is not logged in
    showPage(loginPage);
  }
  
  // Set minimum date for visit form to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('visit-date').setAttribute('min', today);
});
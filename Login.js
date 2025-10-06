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

// FAQ Chat Elements
const faqChatBtn = document.getElementById('faq-chat-btn');
const faqChatWidget = document.getElementById('faq-chat-widget');
const faqChatClose = document.getElementById('faq-chat-close');
const faqChatSend = document.getElementById('faq-chat-send');
const faqChatInput = document.getElementById('faq-chat-input');
const faqChatMessages = document.getElementById('faq-chat-messages');

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
// APPLICATION STATE MANAGEMENT
// ===========================================
let visitRequests = JSON.parse(localStorage.getItem('visitRequests')) || [];
let applicationStatus = JSON.parse(localStorage.getItem('applicationStatus')) || {
  currentStep: 0,
  steps: [
    { name: 'Registered', completed: true, active: false },
    { name: 'Application', completed: false, active: true },
    { name: 'Documents', completed: false, active: false },
    { name: 'Payment', completed: false, active: false },
    { name: 'Review', completed: false, active: false },
    { name: 'Approved', completed: false, active: false }
  ]
};

let paymentDetails = JSON.parse(localStorage.getItem('paymentDetails')) || {
  admissionFee: 5000,
  annualCharges: 12000,
  paidAmount: 0,
  pendingAmount: 17000,
  paymentMethod: '',
  status: 'pending'
};

// ===========================================
// FAQ CHAT FUNCTIONALITY
// ===========================================
const faqResponses = {
  'procedure': `The admission procedure involves 6 steps:
  1. Registration & Login
  2. Select Standard
  3. Fill Student & Parent Details
  4. Upload Required Documents
  5. Make Payment
  6. Application Review & Approval
  
  You can track your progress in the Dashboard.`,

  'documents': `Required documents for admission:
  • Student's Birth Certificate
  • Previous School Leaving Certificate
  • Aadhaar Card of Student & Parents
  • Student's Passport Size Photo
  • Address Proof
  • Parent's ID Proof`,

  'fees': `Fee Structure (per annum):
  • Admission Fee: ₹5,000 (one-time)
  • Annual Charges: ₹12,000
  • Total: ₹17,000
  
  Additional charges may apply for transportation and extracurricular activities.`,

  'payment': `Payment Options Available:
  • Online: Credit/Debit Card, UPI, Net Banking
  • Offline: Cash payment at school office
  • Installments: Available on request
  
  For offline payment, visit school office with your application ID.`,

  'status': `Check your application status in the Dashboard. It shows:
  • Current step in admission process
  • Documents submitted
  • Payment status
  • Visit requests
  • Estimated completion time`,

  'visit': `School Visit Scheduling:
  • Use "Visit School" option in navigation
  • Select preferred date and time
  • Mention purpose of visit
  • We'll confirm via email/phone
  • Bring required documents during visit`,

  'default': `I can help you with:
  • Admission procedure (type "procedure")
  • Required documents (type "documents") 
  • Fee structure (type "fees")
  • Payment options (type "payment")
  • Application status (type "status")
  • School visit (type "visit")
  
  Just type any of these keywords!`
};

// FAQ Chat Functions
function setupFaqChat() {
  faqChatBtn.addEventListener('click', () => {
    faqChatWidget.classList.remove('hidden');
  });

  faqChatClose.addEventListener('click', () => {
    faqChatWidget.classList.add('hidden');
  });

  faqChatSend.addEventListener('click', sendFaqMessage);
  
  faqChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendFaqMessage();
    }
  });
}

function sendFaqMessage() {
  const message = faqChatInput.value.trim();
  if (!message) return;

  // Add user message
  addFaqMessage(message, 'user');
  faqChatInput.value = '';

  // Generate bot response
  setTimeout(() => {
    const response = generateFaqResponse(message);
    addFaqMessage(response, 'bot');
  }, 1000);
}

function generateFaqResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('procedure') || lowerMessage.includes('process') || lowerMessage.includes('step')) {
    return faqResponses.procedure;
  } else if (lowerMessage.includes('document') || lowerMessage.includes('required') || lowerMessage.includes('paper')) {
    return faqResponses.documents;
  } else if (lowerMessage.includes('fee') || lowerMessage.includes('charge') || lowerMessage.includes('cost')) {
    return faqResponses.fees;
  } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('online') || lowerMessage.includes('cash')) {
    return faqResponses.payment;
  } else if (lowerMessage.includes('status') || lowerMessage.includes('progress') || lowerMessage.includes('where')) {
    return faqResponses.status;
  } else if (lowerMessage.includes('visit') || lowerMessage.includes('tour') || lowerMessage.includes('meet')) {
    return faqResponses.visit;
  } else {
    return faqResponses.default;
  }
}

function addFaqMessage(text, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('faq-message', `${sender}-message`);
  messageElement.textContent = text;
  faqChatMessages.appendChild(messageElement);
  faqChatMessages.scrollTop = faqChatMessages.scrollHeight;
}

// ===========================================
// APPLICATION STATUS MANAGEMENT
// ===========================================
function updateApplicationStatus() {
  // Get current progress from localStorage
  const hasRegistered = localStorage.getItem('userData');
  const hasSelectedStandard = localStorage.getItem('selectedStandard');
  const hasSubmittedDetails = localStorage.getItem('studentDetails');
  const hasMadePayment = localStorage.getItem('paymentCompleted');
  
  // Update status based on progress
  applicationStatus.steps[0].completed = !!hasRegistered;
  applicationStatus.steps[1].completed = !!hasSelectedStandard;
  applicationStatus.steps[2].completed = !!hasSubmittedDetails;
  applicationStatus.steps[3].completed = !!hasMadePayment;
  
  // Set active step
  applicationStatus.steps.forEach((step, index) => {
    step.active = false;
  });
  
  if (!hasMadePayment && hasSubmittedDetails) {
    applicationStatus.steps[3].active = true;
    applicationStatus.currentStep = 3;
  } else if (!hasSubmittedDetails && hasSelectedStandard) {
    applicationStatus.steps[2].active = true;
    applicationStatus.currentStep = 2;
  } else if (!hasSelectedStandard && hasRegistered) {
    applicationStatus.steps[1].active = true;
    applicationStatus.currentStep = 1;
  } else if (hasMadePayment) {
    applicationStatus.steps[4].active = true;
    applicationStatus.currentStep = 4;
  }
  
  localStorage.setItem('applicationStatus', JSON.stringify(applicationStatus));
}

function renderApplicationStatus() {
  const statusTimeline = document.querySelector('.status-timeline');
  const statusDetails = document.querySelector('.status-details');
  
  if (!statusTimeline) return;
  
  let timelineHTML = '';
  let detailsHTML = '';
  
  applicationStatus.steps.forEach((step, index) => {
    let stepClass = 'pending';
    if (step.completed) stepClass = 'completed';
    if (step.active) stepClass = 'active';
    
    const icons = ['📝', '📋', '📄', '💳', '👀', '✅'];
    
    timelineHTML += `
      <div class="timeline-step ${stepClass}">
        <div class="step-icon">${icons[index]}</div>
        <div class="step-label">${step.name}</div>
      </div>
    `;
  });
  
  statusTimeline.innerHTML = timelineHTML;
  
  // Status details based on current step
  const currentStep = applicationStatus.currentStep;
  const details = {
    0: `<h4>Getting Started</h4><p>Complete your registration to begin the admission process.</p>`,
    1: `<h4>Select Standard</h4><p>Choose the appropriate standard for admission and view fee structure.</p>`,
    2: `<h4>Student Details</h4><p>Fill in student and parent information along with required documents.</p>`,
    3: `<h4>Payment Pending</h4><p>Complete the payment process to submit your application.</p>`,
    4: `<h4>Under Review</h4><p>Your application is being reviewed by our admission team.</p>`,
    5: `<h4>Approval</h4><p>Congratulations! Your admission has been approved.</p>`
  };
  
  statusDetails.innerHTML = details[currentStep] || details[0];
}

// ===========================================
// PAYMENT MANAGEMENT
// ===========================================
function updatePaymentStatus(method, amountPaid = 0) {
  if (method === 'cash') {
    paymentDetails.paymentMethod = 'Cash (Offline)';
    paymentDetails.paidAmount = 0;
    paymentDetails.pendingAmount = paymentDetails.admissionFee + paymentDetails.annualCharges;
    paymentDetails.status = 'pending';
  } else {
    paymentDetails.paymentMethod = method;
    paymentDetails.paidAmount = paymentDetails.admissionFee + paymentDetails.annualCharges;
    paymentDetails.pendingAmount = 0;
    paymentDetails.status = 'completed';
  }
  
  localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
}

function renderPaymentStatus() {
  const paymentStatusElement = document.querySelector('.payment-status');
  if (!paymentStatusElement) return;
  
  const isPending = paymentDetails.pendingAmount > 0;
  
  paymentStatusElement.className = `payment-status ${isPending ? 'pending' : 'completed'}`;
  
  paymentStatusElement.innerHTML = `
    <h4>Payment Status: ${isPending ? 'Pending' : 'Completed'}</h4>
    <div class="payment-details">
      <div class="payment-detail-item">
        <span>Admission Fee:</span>
        <span>₹${paymentDetails.admissionFee}</span>
      </div>
      <div class="payment-detail-item">
        <span>Annual Charges:</span>
        <span>₹${paymentDetails.annualCharges}</span>
      </div>
      <div class="payment-detail-item">
        <span>Paid Amount:</span>
        <span>₹${paymentDetails.paidAmount}</span>
      </div>
      <div class="payment-detail-item">
        <span>Pending Amount:</span>
        <span>₹${paymentDetails.pendingAmount}</span>
      </div>
      <div class="payment-detail-item">
        <span>Payment Method:</span>
        <span>${paymentDetails.paymentMethod || 'Not Selected'}</span>
      </div>
    </div>
    ${isPending ? '<p style="color: #ff9800; margin-top: 10px; font-weight: 500;">Please complete the payment at school office.</p>' : ''}
  `;
}

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
  
  // Update specific pages when shown
  if (page === dashboardPage) {
    updateDashboard();
    updateApplicationStatus();
    renderApplicationStatus();
    renderPaymentStatus();
  } else if (page === paymentConfirmationPage) {
    updateConfirmationPage();
  }
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
    
    // Initialize application status
    updateApplicationStatus();
    
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
  
  // Initialize application status
  updateApplicationStatus();
  
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
  
  // Store feedback
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
    timestamp: new Date().toISOString(),
    status: 'Pending'
  };
  
  visitRequests.push(visitRequest);
  localStorage.setItem('visitRequests', JSON.stringify(visitRequests));
  
  alert('Your visit request has been submitted! We will contact you soon.');
  visitForm.reset();
  showPage(homePage);
});

// Update dashboard with visit requests
function updateDashboard() {
  const visitInfo = document.querySelector('.visit-info');
  
  if (visitRequests.length === 0) {
    visitInfo.innerHTML = '<p>No visit requests submitted yet</p>';
    return;
  }
  
  let html = '<h3>Your Visit Requests:</h3>';
  visitRequests.forEach((request, index) => {
    html += `
      <div class="visit-request-item">
        <p><strong>Date:</strong> ${new Date(request.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${request.time}</p>
        <p><strong>Purpose:</strong> ${request.purpose || 'Not specified'}</p>
        <p><strong>Status:</strong> <span class="status-pending">${request.status}</span></p>
        <hr>
      </div>
    `;
  });
  
  visitInfo.innerHTML = html;
}

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
  
  // Update application status
  updateApplicationStatus();
  
  showPage(detailsDocumentsPage);
});

// Student details form
detailsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Store student details
  const studentDetails = {
    studentName: document.getElementById('student-name').value,
    birthDate: document.getElementById('birthdate').value,
    fatherName: document.getElementById('father-name').value,
    motherName: document.getElementById('mother-name').value,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('studentDetails', JSON.stringify(studentDetails));
  
  // Update application status
  updateApplicationStatus();
  
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
  
  // Update payment status
  updatePaymentStatus(paymentMethod);
  
  // Mark payment as completed for online payments
  if (paymentMethod !== 'Cash on Pay') {
    localStorage.setItem('paymentCompleted', 'true');
  }
  
  // Update application status
  updateApplicationStatus();
  
  showPage(paymentConfirmationPage);
});

// Update confirmation page with payment details
function updateConfirmationPage() {
  const standard = localStorage.getItem('selectedStandard') || 'N/A';
  confStandard.textContent = `Standard ${standard}`;
  confMethod.textContent = paymentDetails.paymentMethod;
  
  // Generate a fake transaction ID
  const transactionId = 'TXN' + Date.now();
  confTransaction.textContent = transactionId;
  
  // Add payment status to confirmation page
  const confirmationContent = document.querySelector('.confirmation-content');
  if (confirmationContent && paymentDetails.pendingAmount > 0) {
    const paymentStatusHTML = `
      <div class="payment-status pending" style="margin: 20px 0;">
        <h4>Payment Status: Pending</h4>
        <p>Pending Amount: <strong>₹${paymentDetails.pendingAmount}</strong></p>
        <p>Please visit the school office to complete your payment.</p>
        <p>Bring your application ID and required documents.</p>
      </div>
    `;
    confirmationContent.insertAdjacentHTML('beforeend', paymentStatusHTML);
  }
}

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
// INTERACTIVE FEATURES
// ===========================================
// Quick action buttons
function showVirtualTour() {
  alert('Virtual tour feature coming soon! Explore our campus through interactive 360° views.');
}

function downloadBrochure() {
  alert('Brochure download started! Check your downloads folder.');
  // Simulate download
  setTimeout(() => {
    alert('Brochure downloaded successfully!');
  }, 2000);
}

function contactSupport() {
  alert('Contact our support team at: support@canwasschool.edu\nPhone: +91-XXXXX-XXXXX');
}

// Animated counters
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    animateCounter(counter, target);
  });
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 20);
}

// Accordion functionality
function setupAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isActive = content.classList.contains('active');
      
      // Close all accordion items
      document.querySelectorAll('.accordion-content').forEach(item => {
        item.classList.remove('active');
      });
      
      document.querySelectorAll('.accordion-header i').forEach(icon => {
        icon.className = 'fas fa-chevron-down';
      });
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        content.classList.add('active');
        this.querySelector('i').className = 'fas fa-chevron-up';
      }
    });
  });
}

// ===========================================
// INITIALIZATION
// ===========================================
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
  
  // Load visit requests
  visitRequests = JSON.parse(localStorage.getItem('visitRequests')) || [];
  
  // Load application status
  applicationStatus = JSON.parse(localStorage.getItem('applicationStatus')) || applicationStatus;
  paymentDetails = JSON.parse(localStorage.getItem('paymentDetails')) || paymentDetails;
  
  // Set minimum date for visit form to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('visit-date').setAttribute('min', today);
  
  // Initialize interactive features
  animateCounters();
  setupAccordions();
  setupFaqChat();
});
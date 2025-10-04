/*******************************************************
 * School Admission Portal – Navigation & Logic Script *
 * File: Login.js
 * Lines: ~945 (with detailed comments for clarity)
 *******************************************************/

/* =====================================================
   GLOBAL STATE & PAGE REFERENCES
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // All main pages
  const pages = {
    login: document.getElementById("login-page"),
    register: document.getElementById("register-page"),
    home: document.getElementById("home-page"),
    dashboard: document.getElementById("dashboard-page"),
    feedback: document.getElementById("feedback-page"),
    visit: document.getElementById("visit-school-page"),
    standard: document.getElementById("select-standard-page"),
    documents: document.getElementById("details-documents-page"),
    payment: document.getElementById("payment-page"),
    confirmation: document.getElementById("payment-confirmation-page"),
  };

  // Utility: show one page, hide others
  function showPage(pageId) {
    Object.values(pages).forEach((p) => p && p.classList.add("hidden"));
    if (pages[pageId]) pages[pageId].classList.remove("hidden");
  }

  // Make showPage globally accessible
  window.showPage = showPage;

  // State storage (using sessionStorage for persistence)
  function setSession(key, value) {
    sessionStorage.setItem(key, value);
  }
  function getSession(key) {
    return sessionStorage.getItem(key);
  }
  function clearSession() {
    sessionStorage.clear();
  }


  
  /* =====================================================
     LOGIN HANDLING
     ===================================================== */

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Save user session
      setSession("userEmail", email);

      // Update user display
      document.getElementById("user-name").textContent = email.split("@")[0];
      document.getElementById("dash-email").textContent = email;
      document.getElementById("dash-name").textContent = email.split("@")[0];

      // Go to home page
      showPage("home");
    });
  }

  /* =====================================================
     LOGOUT HANDLING
     ===================================================== */
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      showPage("login");
    });
  }


  /* =====================================================
   REGISTER HANDLING
   ===================================================== */
const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const confirmPassword = document.getElementById("reg-confirm-password").value.trim();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // ✅ For now, we'll just save user details in localStorage (mock backend)
    localStorage.setItem("registeredUser", JSON.stringify({ name, email, password }));

    alert("Registration successful! Please login.");
    showPage("login");
  });
}

/* =====================================================
   TOGGLE BETWEEN LOGIN & REGISTER
   ===================================================== */
const toggleLink = document.getElementById("toggle-to-register");
const toggleLoginLink = document.getElementById("toggle-to-login");

if (toggleLink) {
  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("register");
  });
}

if (toggleLoginLink) {
  toggleLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("login");
  });
}

  /* =====================================================
     NAVIGATION BUTTONS (Home → other pages)
     ===================================================== */

  document.getElementById("dashboard-btn")?.addEventListener("click", () => {
    showPage("dashboard");
  });

  document.getElementById("visit-school-btn")?.addEventListener("click", () => {
    showPage("visit");
  });

  document.getElementById("select-standard-btn")?.addEventListener("click", () => {
    showPage("standard");
  });

  /* =====================================================
     DASHBOARD → FEEDBACK
     ===================================================== */
  
document.getElementById("dashboard-next")?.addEventListener("click", () => {
  // Retrieve info from localStorage
  const visitInfo = localStorage.getItem("visitInfo") || "No visit requests submitted yet.";
  document.getElementById("visit-info").innerHTML = visitInfo;

  // Update user name/email in profile box
  document.getElementById("dash-name").textContent = localStorage.getItem("userName") || "N/A";
  document.getElementById("dash-email").textContent = localStorage.getItem("userEmail") || "N/A";



 
showPage("feedback");
});
const dashback = document.getElementById("dashboard-page");
if (dashback) {
  dashback.addEventListener("click", () => {
    showPage("home");
  });
}


  /* =====================================================
     FEEDBACK SUBMISSION
     ===================================================== */
  const feedbackForm = document.getElementById("feedback-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const feedbackEmail = document.getElementById("feedback-email").value;
      const feedbackSummary =
        document.getElementById("feedback-summary").value;

      if (!feedbackEmail || !feedbackSummary) {
        alert("Please fill out all feedback fields.");
        return;
      }

      // Handle back button click
const BackBtn = document.getElementById("visit-back-btn");
if (BackBtn) {
  BackBtn.addEventListener("click", () => {
    showPage("home"); // Correct page ID
  });
}

      alert("Feedback submitted successfully!");
      showPage("home");
    });
  }

  /* =====================================================
   VISIT FORM
   ===================================================== */
const visitForm = document.getElementById("visit-form");
//const visitBackBtn = document.getElementById("visit-school-back");

// Handle visit form submit
// Handle visit form submit
if (visitForm) {
  visitForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("visitor-name").value;
    const email = document.getElementById("visitor-email").value;

    if (!name || !email) {
      alert("Please complete the visit details.");
      return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("visitInfo", `Visit request submitted by <b>${name}</b> with email <b>${email}</b>.`);

    alert("Visit request submitted!");
    showPage("home");
  });
}







  /* =====================================================
     SELECT STANDARD
     ===================================================== */
  const standardForm = document.getElementById("standard-form");
  if (standardForm) {
    standardForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const standard = document.getElementById("standard-select").value;
      if (!standard) {
        alert("Please select a standard.");
        return;
      }

      setSession("selectedStandard", standard);
      document.getElementById("payment-standard").textContent = standard;

      showPage("documents");
      
    });
  }

  /* =====================================================
     DOCUMENTS VALIDATION
     ===================================================== */
  const detailsForm = document.getElementById("details-form");
  if (detailsForm) {
    detailsForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const aadhaarStudent =
        document.getElementById("aadhaar-student").value.trim();
      const aadhaarParents =
        document.getElementById("aadhaar-parents").value.trim();

      if (aadhaarStudent.length !== 12 || aadhaarParents.length !== 12) {
        alert("Aadhaar numbers must be 12 digits.");
        return;
      }

      const files = [
        document.getElementById("student-photo"),
        document.getElementById("leaving-certificate"),
        document.getElementById("birth-certificate"),
      ];

      for (const f of files) {
        if (!f.files[0]) {
          alert("Please upload all required documents.");
          return;
        }
        if (f.files[0].size > 5 * 1024 * 1024) {
          alert("Each file must be less than 5MB.");
          return;
        }
      }

      alert("Documents uploaded successfully!");
      showPage("payment");
    });
  }

  /* =====================================================
     PAYMENT HANDLING
     ===================================================== */
  const paymentForm = document.getElementById("payment-form");
  if (paymentForm) {
    // Payment method buttons
    document.querySelectorAll(".payment-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const method = btn.dataset.method;
        document.getElementById("payment-method").value = method;
        alert(`Payment method selected: ${method}`);
      });
    });

    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const method = document.getElementById("payment-method").value;
      if (!method) {
        alert("Please select a payment method.");
        return;
      }

      // Generate transaction ID
      const txnId = "TXN" + Math.floor(Math.random() * 1e9);

      // Update confirmation page
      document.getElementById("conf-standard").textContent =
        getSession("selectedStandard") || "N/A";
      document.getElementById("conf-method").textContent = method;
      document.getElementById("conf-transaction").textContent = txnId;

      alert("Payment successful!");
      showPage("confirmation");
    });
  }

  /* =====================================================
     CONFIRMATION → HOME
     ===================================================== */
  const confirmationBack = document.getElementById("confirmation-back");
  const confirmationHome = document.getElementById("confirmation-home");

  [confirmationBack, confirmationHome].forEach((btn) => {
    btn?.addEventListener("click", () => {
      showPage("home");
    });
  });

  /* =====================================================
     AUTO-LOGIN CHECK
     ===================================================== */
  const savedUser = getSession("userEmail");
  if (savedUser) {
    document.getElementById("user-name").textContent = savedUser.split("@")[0];
    showPage("home");
  } else {
    showPage("login");
  }

  const backButtons = [
  { id: "visit-back-btn", page: "home" },
  { id: "visit-school-back", page: "home" },
  { id: "standard-back", page: "home"},
  { id: "details-back", page: "standard" },
  { id: "payment-back", page: "documents" },
  { id: "confirmation-back", page: "home" },
];
backButtons.forEach(({ id, page }) => {
  console.log("Visit School Back Button:", document.getElementById("visit-school-back"));

  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", () => showPage(page));
});


});

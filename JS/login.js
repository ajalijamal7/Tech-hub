$(document).ready(function () {
  // ---- Hamburger Menu Toggle ----
function initHamburgerMenu() {
  const $hamburger = $("#hamburger");
  const $navLinks = $("#navLinks");
  
  if ($hamburger.length && $navLinks.length) {
    $hamburger.on("click", function() {
      $navLinks.toggleClass("open");
      console.log("Hamburger clicked - menu toggled");
    });
    
    // Close menu when clicking on a link
    $navLinks.find("a").on("click", function() {
      $navLinks.removeClass("open");
    });
  } else {
    console.log("Hamburger menu elements not found");
  }
}

// Initialize hamburger menu
initHamburgerMenu();

  let $container = $("#body-container");
  const USERS_KEY = "users";
  const CURRENT_USER_KEY = "currentUser";

  // ---- helpers for localStorage ----
  function getUsers() {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    const data = sessionStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  function saveCurrentUser(user) {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  function removeCurrentUser() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
  }

  // Update UI based on login status
  function updateLoginUI() {
    const currentUser = getCurrentUser();

    if (currentUser) {
      // User is logged in - show dashboard
      $container.addClass("user-logged-in");
      $("#welcome_Message").text(`Hello ${currentUser.name}!`);
      $("#welcomeMessage").text(`Welcome!`);
      $("#welcomeSubtext").text("You are successfully logged in and can now access all site features.");
      $("#register").text("Logout").removeClass("register-btn").addClass("logout-btn");
      $("#login-logout-message").text("We’re grateful you’re here. Let’s continue the journey.")
    } else {
      // User is logged out - show forms
      $container.removeClass("user-logged-in active");
      $("#welcome_Message").text(`Hello, !`);
      $("#welcomeSubtext").text("Register with your personal details to use all of site features");
      $("#register").text("Sign Up").removeClass("logout-btn").addClass("register-btn");
      $("#login-logout-message").text("Register with your personal details to use all of site features")
    }
  }

  // Check login status on page load
  updateLoginUI();

  $("#register").on("click", function () {
    const currentUser = getCurrentUser();

    if (currentUser) {
      // User is logged in - perform logout
      removeCurrentUser();
      updateLoginUI();
      alert("You have been logged out successfully!");
    } else {
      // User is logged out - show register form
      $container.addClass("active");
    }
  });

  $("#login").on("click", function () {
    $container.removeClass("active");
  });

  $("#registerBtn").on("click", function (e) {
    e.preventDefault();

    const name = $(".sign-up input[type='text']").val().trim();
    const email = $(".sign-up input[type='email']").val().trim();
    const password = $(".sign-up input[type='password']").val();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    let users = getUsers();

    // check if email already exists
    const existing = users.find(u => u.email === email);
    if (existing) {
      alert("This email is already registered. Please log in.");
      return;
    }

    // push new user into array
    users.push({
      name: name,
      email: email,
      password: password
    });

    // save back to localStorage
    saveUsers(users);

    alert("Account created successfully! Please log in with your credentials.");

    // DON'T auto-login - instead switch to login form
    $container.removeClass("active");

    // Clear form
    $(".sign-up input[type='text']").val("");
    $(".sign-up input[type='email']").val("");
    $(".sign-up input[type='password']").val("");

    // Pre-fill the email in login form for convenience
    $(".sign-in input[type='email']").val(email);
  });

  // ---- SIGN IN ----
  $("#loginBtn").on("click", function (e) {
    e.preventDefault();

    const email = $(".sign-in input[type='email']").val().trim();
    const password = $(".sign-in input[type='password']").val();

    let users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      alert("Login successful! Welcome " + user.name);

      // Save current user
      saveCurrentUser(user);

      // Update UI to show dashboard
      updateLoginUI();

      // Clear form
      $(".sign-in input[type='email']").val("");
      $(".sign-in input[type='password']").val("");
    } else {
      alert("Incorrect email or password, or user not found.");
    }
  });
});
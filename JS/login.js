$(function () {
  let hamburger = $("#hamburger");
  let navDesc = $("#navLinks");

  hamburger.on("click", function () {
  navDesc.toggleClass("open");
  });
});

$(document).ready(function () {
  let $container = $("#body-container");

  $("#register").on("click", function () {
    $container.addClass("active");   
  });

  $("#login").on("click", function () {
    $container.removeClass("active"); 
  });

const USERS_KEY = "users";

  // ---- helpers for localStorage ----
  function getUsers() {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }


  $("#registerBtn").on("click", function (e) {
    e.preventDefault(); // stop form from reloading the page

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

    alert("Account created successfully!");

    // optional: switch to login panel after sign up
    $("#container").removeClass("active");
  });

  // ---- SIGN IN ----
  $("#loginBtn").on("click", function (e) {
    e.preventDefault(); // stop form submit

    const email = $(".sign-in input[type='email']").val().trim();
    const password = $(".sign-in input[type='password']").val();

    let users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      alert("Login successful! Welcome " + user.name);
      sessionStorage.setItem("currentUser",JSON.stringify(user))
    } else {
      alert("Incorrect email or password, or user not found.");
    }
  });
});

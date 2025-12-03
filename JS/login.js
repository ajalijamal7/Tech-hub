$(function () {
    let $hamburger = $("#hamburger");
    let $navLinks = $("#navLinks");
    let $container = $("#body-container");
    const USERS_KEY = "users";
    const CURRENT_USER_KEY = "currentUser";

    if ($hamburger.length && $navLinks.length) {
        $hamburger.on("click", function () {
            $navLinks.toggleClass("open");
        });

        $navLinks.find("a").on("click", function () {
            $navLinks.removeClass("open");
        });
    }

    function getUsers() {
        let data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getCurrentUser() {
        let data = sessionStorage.getItem(CURRENT_USER_KEY);
        return data ? JSON.parse(data) : null;
    }

    function saveCurrentUser(user) {
        sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    function removeCurrentUser() {
        sessionStorage.removeItem(CURRENT_USER_KEY);
    }

    function updateLoginUI() {
        let currentUser = getCurrentUser();
        if (currentUser) {
            $container.addClass("user-logged-in");
            $("#welcome_Message").text(`Hello, ${currentUser.name}!`);
            $("#welcomeMessage").text("Welcome!");
            $("#welcomeSubtext").text("You are successfully logged in and can now access all site features.");
            $("#register").text("Logout").removeClass("register-btn").addClass("logout-btn");
            $("#login-logout-message").text("We're grateful you're here. Let's continue the journey.");
        } else {
            $container.removeClass("user-logged-in active");
            $("#welcome_Message").text("Hello !");
            $("#welcomeSubtext").text("Register with your personal details to use all of site features");
            $("#register").text("Sign Up").removeClass("logout-btn").addClass("register-btn");
            $("#login-logout-message").text("Register with your personal details to use all of site features");
        }
    }

    updateLoginUI();

    $("#register").on("click", function () {
        let currentUser = getCurrentUser();
        if (currentUser) {
            removeCurrentUser();
            updateLoginUI();
            alert("You have been logged out successfully!");
        } else {
            $container.addClass("active");
        }
    });

    $("#login").on("click", function () {
        $container.removeClass("active");
    });

    $("#registerBtn").on("click", function (e) {

        let form = $(this).closest("form")[0];
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        e.preventDefault();
        let name = $(".sign-up input[type='text']").val().trim();
        let email = $(".sign-up input[type='email']").val().trim();
        let password = $(".sign-up input[type='password']").val();
        if (!name || !email || !password) {
            alert("Please fill all fields.");
            return;
        }
        let users = getUsers();
        if ($.grep(users, function (u) { return u.email === email; }).length) {
            alert("This email is already registered. Please log in.");
            return;
        }
        users.push({ name: name, email: email, password: password });
        saveUsers(users);
        alert("Account created successfully! Please log in with your credentials.");
        $container.removeClass("active");
        $(".sign-up input[type='text'], .sign-up input[type='email'], .sign-up input[type='password']").val("");
        $(".sign-in input[type='email']").val(email);
    });

    $("#loginBtn").on("click", function (e) {
        let form = $(this).closest("form")[0];


        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        e.preventDefault();
        let email = $(".sign-in input[type='email']").val().trim();
        let password = $(".sign-in input[type='password']").val();
        let users = getUsers();
        let user = $.grep(users, function (u) { return u.email === email && u.password === password; })[0];
        if (user) {
            alert("Login successful! Welcome " + user.name);
            saveCurrentUser(user);
            updateLoginUI();
            $(".sign-in input[type='email'], .sign-in input[type='password']").val("");
        } else {
            alert("Incorrect email or password, or user not found.");
        }
    });

    $(".password-field span").on("click", function () {
        let $icon = $(this);
        let $input = $icon.siblings("input");

        if ($input.attr("type") === "password") {
            $input.attr("type", "text");
            $icon.text("visibility");
        } else {
            $input.attr("type", "password");
            $icon.text("visibility_off");
        }
    });


});

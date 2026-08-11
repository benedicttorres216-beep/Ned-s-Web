const email = document.getElementById("email");
const password = document.getElementById("password");

const emailContainer = document.getElementById("emailContainer");
const passwordContainer = document.getElementById("passwordContainer");

const loginBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleBtn");
const githubBtn = document.getElementById("githubBtn");
const createAccount = document.getElementById("createAccount");
const message = document.getElementById("message");

email.addEventListener("input", function () {
    emailContainer.classList.toggle(
        "has-value",
        email.value.trim() !== ""
    );
});

password.addEventListener("input", function () {
    passwordContainer.classList.toggle(
        "has-value",
        password.value.trim() !== ""
    );
});

function showMessage(text) {
    message.textContent = text;
    message.classList.add("show");

    clearTimeout(window.messageTimer);

    window.messageTimer = setTimeout(function () {
        message.classList.remove("show");
    }, 3000);
}

function fakeLogin() {
    if (loginBtn.classList.contains("loading")) {
        return;
    }

    if (email.value.trim() === "") {
        showMessage("Please enter your email or username.");
        email.focus();
        return;
    }

    if (password.value.trim() === "") {
        showMessage("Please enter your password.");
        password.focus();
        return;
    }

    message.classList.remove("show");

    loginBtn.classList.add("loading");
    loginBtn.disabled = true;

    setTimeout(function () {
        loginBtn.classList.remove("loading");
        loginBtn.disabled = false;

        showMessage("Login successful!");
    }, 1500);
}

loginBtn.addEventListener("click", fakeLogin);

password.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        fakeLogin();
    }
});

googleBtn.addEventListener("click", function () {
    showMessage("Google sign-in selected.");
});

githubBtn.addEventListener("click", function () {
    showMessage("GitHub sign-in selected.");
});

createAccount.addEventListener("click", function (event) {
    event.preventDefault();
    showMessage("Create Account selected.");
});
 document.addEventListener("DOMContentLoaded", function () {

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const emailContainer = document.getElementById("emailContainer");
    const passwordContainer = document.getElementById("passwordContainer");

    const loginBtn = document.getElementById("loginBtn");
    const googleBtn = document.getElementById("googleBtn");
    const githubBtn = document.getElementById("githubBtn");
    const createAccount = document.getElementById("createAccount");
    const message = document.getElementById("message");

    function showMessage(text) {
        if (!message) return;

        message.textContent = text;
        message.classList.add("show");

        clearTimeout(window.messageTimer);

        window.messageTimer = setTimeout(function () {
            message.classList.remove("show");
        }, 3000);
    }

    email.addEventListener("input", function () {
        emailContainer.classList.toggle(
            "has-value",
            email.value.trim() !== ""
        );
    });

    password.addEventListener("input", function () {
        passwordContainer.classList.toggle(
            "has-value",
            password.value.trim() !== ""
        );
    });

    function fakeLogin() {

        if (loginBtn.classList.contains("loading")) {
            return;
        }

        if (email.value.trim() === "") {
            showMessage("Please enter your email or username.");
            email.focus();
            return;
        }

        if (password.value.trim() === "") {
            showMessage("Please enter your password.");
            password.focus();
            return;
        }

        message.classList.remove("show");

        loginBtn.classList.add("loading");
        loginBtn.disabled = true;

        setTimeout(function () {

            loginBtn.classList.remove("loading");
            loginBtn.disabled = false;

            showMessage("Login successful!");

        }, 2000);
    }

    loginBtn.addEventListener("click", fakeLogin);

    password.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            fakeLogin();
        }
    });

    googleBtn.addEventListener("click", function () {
        showMessage("Google sign-in selected.");
    });

    githubBtn.addEventListener("click", function () {
        showMessage("GitHub sign-in selected.");
    });

    createAccount.addEventListener("click", function (event) {
        event.preventDefault();
        showMessage("Create Account selected.");
    });

});

function checkLoginRedirect() {
    if (!(localStorage.getItem("loggedUser") === null || localStorage.getItem("loggedUser") === "")) {
        alert("Cierre su sesión actual para poder iniciar una nueva");
        window.location = "index.html";
    }
}
checkLoginRedirect() // To check whether there is a user already logged and redirect if true

function loginSucces(userEmail) {
    localStorage.setItem("loggedUser", userEmail);
    window.location = "index.html";
}

// Google sign in and redirect function
function onSignIn(response) {
    const responsePayload = jwt_decode(response.credential);// Decodes the response received from google API
    console.log(responsePayload);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    // Validate positive response
    if (!responsePayload.email_verified) {
        alert("Hubo un error al iniciar su sesión con Goole, vuelve a intentarlo.")
        return
    }
    loginSucces(responsePayload.email);
}

function loginValidate(emailInput, passInput) {
    if (emailInput.value != "" && passInput.value != "") {// Login only if the user introduced both email and password
        loginSucces(emailInput.value);
    } else {
        if (!emailInput.validity.valid) {
            emailInput.classList.add("is-invalid");
        }
        if (!passInput.validity.valid) {
            passInput.classList.add("is-invalid");
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");

    // Enter key binds
    emailInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            passInput.focus();
        }
    });
    passInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            loginValidate(emailInput, passInput);
        }
    });

    document.getElementById("loginBtn").addEventListener("click", function () {
        loginValidate(emailInput, passInput);
    });

    emailInput.addEventListener("input", function () {
        emailInput.classList.remove("is-invalid");
    })
    passInput.addEventListener("input", function () {
        passInput.classList.remove("is-invalid");
    })
});

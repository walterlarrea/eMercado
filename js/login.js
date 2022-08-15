document.addEventListener("DOMContentLoaded", function(){
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    document.getElementById("loginBtn").addEventListener("click", function() {
        if ( document.getElementById("email").value != "" && document.getElementById("password").value != "" ) {
            loginSucces()
        } else {
            if (!emailInput.validity.valid) {
                emailInput.classList.add("is-invalid");
            }
            if (!passwordInput.validity.valid) {
                passwordInput.classList.add("is-invalid");
            }
        }
    });

    emailInput.addEventListener("input", function () {
        emailInput.classList.remove("is-invalid");
    })
    passwordInput.addEventListener("input", function () {
        passwordInput.classList.remove("is-invalid");
    })
});

function loginSucces() {
    sessionStorage.setItem("loggedIn", true);
    window.location = "index.html";
}
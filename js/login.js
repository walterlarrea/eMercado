function loginSucces(userEmail) {
    localStorage.setItem("loggedUser", userEmail);
    window.location = "index.html";
}

document.addEventListener("DOMContentLoaded", function(){
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");

    passInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          document.getElementById("loginBtn").click();
        }
    });
    document.getElementById("loginBtn").addEventListener("click", function() {
        if ( emailInput.value != "" && passInput.value != "" ) {
            loginSucces(emailInput.value);
        } else {
            if (!emailInput.validity.valid) {
                emailInput.classList.add("is-invalid");
            }
            if (!passInput.validity.valid) {
                passInput.classList.add("is-invalid");
            }
        }
    });

    emailInput.addEventListener("input", function () {
        emailInput.classList.remove("is-invalid");
    })
    passInput.addEventListener("input", function () {
        passInput.classList.remove("is-invalid");
    })
});

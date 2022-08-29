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

    // Script de google SignIn
    // function onSignIn(googleUser) {
    //     let profile = googleUser.getBasicProfile();
    //     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //     console.log('Name: ' + profile.getName());
    //     console.log('Image URL: ' + profile.getImageUrl());
    //     console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // }
    // Script de google SignOut
    // document.getElementById('googleSignOut').addEventListener("click", function() {
    //     let auth2 = gapi.auth2.getAuthInstance();
    //     auth2.signOut().then(function () {
    //     console.log('User signed out.');
    //     });
    // })
});

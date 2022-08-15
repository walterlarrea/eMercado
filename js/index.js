document.addEventListener("DOMContentLoaded", function(){
    //navega al formulario de login en caso que no esté logeado
    if ( sessionStorage.getItem("loggedIn") === null || sessionStorage.getItem("loggedIn") === false ) {
        window.location = "login.html";
    } else {
        let navigationBar = document.getElementsByTagName('ul')
        let logOutOption = document.createElement('li');
        let logOutLink = document.createElement('a');

        logOutLink.innerHTML = "Cerrar sesión";
        logOutLink.id = "full-log-out";
        logOutLink.classList.add("nav-link");
        logOutOption.classList.add("nav-item");

        logOutOption.appendChild(logOutLink);
        navigationBar[0].appendChild(logOutOption);
    }

    document.getElementById("full-log-out").addEventListener("click", function() {
        sessionStorage.setItem("loggedIn", false);
        let auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
    });
    })

    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});
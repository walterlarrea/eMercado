// Redirect to login page if not already logged in
function forceUserLogin() {
    if (localStorage.getItem("loggedUser") === null || localStorage.getItem("loggedUser") === "") {
        window.location = "login.html";
    }
}

// Load user info on to the navigation bar
function showUser() {
    let navUserLink = document.createElement('a');
    navUserLink.classList.add("nav-link");
    navUserLink.innerHTML = localStorage.getItem("loggedUser");
    navUserLink.title = "Cerrar sesión (testing)";
    navUserLink.href = "";
    navUserLink.onclick = endUserSession;

    let navBar = document.getElementById('navbarNav').getElementsByTagName('ul');
    let navUserLi = navBar[0].getElementsByTagName('li').item(navBar[0].getElementsByTagName('li').length - 1);
    navUserLi.appendChild(navUserLink);
}

document.addEventListener("DOMContentLoaded", function(){
    forceUserLogin();
    showUser();

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
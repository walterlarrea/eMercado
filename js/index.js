document.addEventListener("DOMContentLoaded", function(){
    if ( sessionStorage.getItem("loggedIn") === null || sessionStorage.getItem("loggedIn") === false ) {
        window.location = "login.html";
    }

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
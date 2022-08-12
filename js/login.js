document.addEventListener("DOMContentLoaded", function(){
    console.log(sessionStorage.getItem("loggedIn"));

    document.getElementById("loginBtn").addEventListener("click", function() {
        if ( document.getElementById("email").value != "" && document.getElementById("password").value != "" ) {
            loginSucces()
        } else {
            alert("Debe ingresar su Email y Contraseña");
        }
    });
});

function loginSucces() {
    sessionStorage.setItem("loggedIn", true);
    window.location = "index.html";
}
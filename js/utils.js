// End user session and redirect to login page
let endUserSession = function(){
    let navBarUls = document.getElementById('navbarNav').getElementsByTagName('ul');
    let navBarLastLi = navBarUls[0].getElementsByTagName('li').item(navBarUls[0].getElementsByTagName('li').length - 1);
  
    navBarLastLi.removeChild(navBarLastLi.childNodes[0]);
    localStorage.removeItem("loggedUser");
  
    // Google oAuth finish session
    // let auth2 = gapi.auth2.getAuthInstance();
    //       auth2.signOut().then(function () {
    //       console.log('User signed out.');
    //       });
  
    window.location = "login.html";
}

// Redirect to login page if not already logged in
function forceUserLogin() {
    if (localStorage.getItem("loggedUser") === null || localStorage.getItem("loggedUser") === "") {
        window.location = "login.html";
    }
}

// Load user info on to the navigation bar
function showUser() {
    let navBar = document.getElementById('navbarNav').getElementsByTagName('ul');
    let navBarLastLi = navBar[0].getElementsByTagName('li').item(navBar[0].getElementsByTagName('li').length - 1);

    navBarLastLi.innerHTML = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${localStorage.getItem("loggedUser").slice(0, localStorage.getItem("loggedUser").toString().search("@"))}
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
            <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
            <li><a class="dropdown-item" href="javascript:endUserSession();">Cerrar sesión</a></li>
        </ul>
    </div>`
}
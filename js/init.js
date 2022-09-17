const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

// // Redirect to login page if not already logged in
// let forceUserLogin = function(){
//   if ( localStorage.getItem("loggedUser") === null || localStorage.getItem("loggedUser") === "" ) {
//     window.location = "login.html";
//   }
// }

// // Load user info on to the navigation bar
// let showUser = function(){
//   let navUserLink = document.createElement('a');
//   navUserLink.classList.add("nav-link");
//   navUserLink.innerHTML = localStorage.getItem("loggedUser");
//   navUserLink.title = "Cerrar sesión (testing)";
//   navUserLink.href = "";
//   navUserLink.onclick = endUserSession;

//   let navBar = document.getElementById('navbarNav').getElementsByTagName('ul');
//   let navUserLi = navBar[0].getElementsByTagName('li').item(navBar[0].getElementsByTagName('li').length - 1);
//   navUserLi.appendChild(navUserLink);
// }

// End user session and redirect to login page
let endUserSession = function(){
  let navBar = document.getElementById('navbarNav').getElementsByTagName('ul');
  let navUserLi = navBar[0].getElementsByTagName('li').item(navBar[0].getElementsByTagName('li').length - 1);

  navUserLi.removeChild(navUserLi.childNodes[0]);
  localStorage.removeItem("loggedUser");

  // Google oAuth finish session
  let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
        console.log('User signed out.');
        });

  window.location = "login.html";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
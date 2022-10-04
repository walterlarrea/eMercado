const userID = 25801;

let userCart = {};
forceUserLogin();

function showArticles() {
    const productListElement = document.getElementById('product-list');
    let htmlProductToAppend = '';
    productListElement.innerHTML = htmlProductToAppend;

    if (userCart?.articles == undefined || userCart.articles?.lenght == 0) return // End function if there are no articles or Articles is undefined

    for (const art of userCart.articles) {
        htmlProductToAppend = `
        <tr>
            <td><img src="${art.image}" alt="${art.name}" class="rounded img-fit-table"></td>
            <td>${art.name}</td>
            <td>${art.currency} ${art.unitCost}</td>
            <td><input type="number" min="1" value="${art.count}" data-prod-id="${art.id}"></td>
            <td>${art.currency} ${art.unitCost * art.count}</td>
        </tr>
        `
        productListElement.innerHTML += htmlProductToAppend;
    }
}

function updateCantAndShowArticles(artID, cant) {
    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));

    userCart.articles[userCart.articles.findIndex(art => art.id === artID)].count = cant;
    locallyStoredCarts[locallyStoredCarts.findIndex(cart => cart.user === userID)] = userCart;
    localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts))

    showArticles();
}

function loadAndShowCartArticles() {
    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));

    userCart = locallyStoredCarts[locallyStoredCarts.findIndex(cart => cart.user === userID)]; // Return the Cart matching the user ID, and get the first element
    showArticles();
}

function updateCarts(apiCart) {
    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));

    if (!(apiCart == {} || apiCart.articles?.lenght == 0)) { // End function if no cart was found or the cart have zero articles
        if (locallyStoredCarts === null) { // Create LocalStorage if doesn't already exist
            localStorage.setItem('cartArticlesByUsrID', JSON.stringify([apiCart]))
            locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));
        }
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    showUser();

    getJSONData(CART_INFO_URL + userID + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            updateCarts(resultObj.data);
        } else {
            alert("No se pudo obtener la lista de productos.\n" + resultObj.data);
        }
    }).then(loadAndShowCartArticles())

    document.addEventListener("input", function (event) {
        updateCantAndShowArticles(parseInt(event.target.getAttribute('data-prod-id')), event.target.value);
    })

});
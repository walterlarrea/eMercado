const userID = USER_ID;

let userCart = {};

forceUserLogin();

function showArticles() {
    const productListElement = document.getElementById('product-list-tb');
    let htmlProductToAppend = '';
    productListElement.innerHTML = htmlProductToAppend;

    if (userCart?.articles == undefined || userCart.articles?.lenght == 0) return // End function if there are no articles or Articles is undefined

    for (const art of userCart.articles) {
        htmlProductToAppend = `
        <tr>
            <td><img src="${art.image}" alt="${art.name}" class="rounded img-fit-table"></td>
            <td>${art.name}</td>
            <td>${art.currency} ${art.unitCost}</td>
            <td><input class="form-control" type="number" min="1" value="${art.count}" data-prod-id="${art.id}"></td>
            <td><button class="btn btn-dark" onclick="deleteArticle(this)" data-prod-id="${art.id}"><i class="fas fa-solid fa-trash"></i> Eliminar</button></td>
            <td><strong>${art.currency} ${art.unitCost * art.count}</strong></td>
        </tr>
        `
        productListElement.innerHTML += htmlProductToAppend;
    }
}

// Update local stored cart articles if count is changed for an article!
function updateCantAndShowArticles(event) {
    let artID = parseInt(event.target.getAttribute('data-prod-id'));
    let cant = event.target.value;

    if (event.target.type.toLowerCase() != 'number') return; // Only process numeric inputs

    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));
    let regExp = /^[1-9]\d*$/g; // Regular expression to test() true only for numeric positive inputs

    if (!regExp.test(cant)) { // Check for valid inputs and set to 1 if wrong
        event.target.value = 1;
        cant = 1;
    }

    userCart.articles[userCart.articles.findIndex(art => art.id === artID)].count = cant;
    locallyStoredCarts[locallyStoredCarts.findIndex(cart => cart.user === userID)] = userCart;
    localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts))

    loadAndShowCartArticles();
}

// Get this user's cart from locally stored cart's data
function loadAndShowCartArticles() {
    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));

    userCart = locallyStoredCarts[locallyStoredCarts.findIndex(cart => cart.user === userID)]; // Return the Cart matching the user ID, and get the first element
    showArticles();
}

function deleteArticle(element) {
    let artIdToDelete = parseInt(element.getAttribute('data-prod-id')); // ID of the selected article
    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));
    let userCartIndex = locallyStoredCarts.findIndex(cart => cart.user === userID)
    let userCart = locallyStoredCarts[userCartIndex]; // This user's Cart

    let artIndex = userCart.articles.findIndex(art => art.id === artIdToDelete); // Finding article to delete index on Cart Articles Array

    if (artIndex >= 0) {
        userCart.articles.splice(artIndex, 1); // Remove the article from index found by article ID
        // Update LocalStorage
        locallyStoredCarts[userCartIndex] = userCart;
        localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts))
    } else {
        alert('Hubo un error al eliminar este artículo');
    }

    loadAndShowCartArticles();

}

function updateCarts(apiCart) { // Load API served Cart into local storage
    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));

    if (apiCart == {} || apiCart.articles?.lenght == 0) return; // Check for valid data and exit if wrong

    if (locallyStoredCarts === null) { // Create LocalStorage if doesn't already exist
        localStorage.setItem('cartArticlesByUsrID', JSON.stringify([]))
        locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));
    }

    let userCartIndex = locallyStoredCarts.findIndex(cart => cart?.user === userID);
    let userCart = locallyStoredCarts[userCartIndex];
    if (userCart < 0 || userCart == undefined) { // Save user Cart if doesn't already exist
        locallyStoredCarts.push(apiCart);
        localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts));
    } else { // Update user Cart using Cart served by API
        for (let i = 0; i < apiCart.articles.length; i++) {
            if (userCart.articles.every(art => art.id != apiCart.articles[i].id)) {
                userCart.articles.push(apiCart.articles[i]);
            }
        }
        locallyStoredCarts[userCartIndex] = userCart;
        localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts));
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
    }).then(loadAndShowCartArticles)

    document.addEventListener("change", (e) => {
        if (e.target.tagName === 'INPUT') {
            updateCantAndShowArticles(e)
        }
    }) // Call update function when CHANGE event triggered on an INPUT

});

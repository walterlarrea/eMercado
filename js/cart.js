const userID = USER_ID;
const DOLLAR_VALUE = 42.2; // Dolar valuation for calculations

let purchaseSubtotalCost = 0;
let shippingComisionCost = 0;
let currentUserCart = {};

forceUserLogin();

function setProdIDAndRedirect(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html";
}

function showArticles() {
    const productListElement = document.getElementById('product-list-tb');
    let htmlProductToAppend = '';
    productListElement.innerHTML = htmlProductToAppend;

    if (currentUserCart.articles?.length === undefined || currentUserCart.articles?.length === 0) return // End function if there are no articles or Articles is undefined

    for (const art of currentUserCart.articles) {
        htmlProductToAppend += `
        <tr>
            <td><img src="${art.image}" alt="${art.name}" onclick="setProdIDAndRedirect(${art.id})" class="rounded img-fit-table"></td>
            <td>${art.name}</td>
            <td>${art.currency} ${art.unitCost}</td>
            <td><input class="form-control" type="number" min="1" max="99" value="${art.count}" data-prod-id="${art.id}"></td>
            <td><strong>${art.currency} ${art.unitCost * art.count}</strong></td>
            <td><button class="btn btn-outline-danger" onclick="deleteArticle(this)" data-prod-id="${art.id}"><i class="fas fa-solid fa-trash"></i><span class="d-none d-md-inline"> Eliminar</span></button></td>
        </tr>
        `
        productListElement.innerHTML = htmlProductToAppend;
    }
}

function updateCosts() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shipping-cost');
    const totalCostElement = document.getElementById('total-cost');

    // Find selected radio button for shipping options
    const shippingTypeSelection = Array.from(document.getElementsByName('shipping-option')).find(radioInput => radioInput.checked);

    purchaseSubtotalCost = parseInt(currentUserCart.articles.reduce((acc, art) => {
        //acc += (art.currency === "USD" ? art.unitCost : art.unitCost / DOLLAR_VALUE) * art.count

        if (art.currency === "USD") return acc + art.unitCost * art.count
        else return acc + (art.unitCost / DOLLAR_VALUE) * art.count // Convert valuations in pesos($) to dollars(USD)
    }, 0));   // Get sub total from the sum of all article costo multiplied by the amount of each

    shippingComisionCost = parseInt(purchaseSubtotalCost * (parseInt(shippingTypeSelection.value) / 100));
    // Calculate shipping costs over subtotal sum

    subtotalElement.innerHTML = purchaseSubtotalCost;
    shippingCostElement.innerHTML = shippingComisionCost;
    totalCostElement.innerHTML = purchaseSubtotalCost + shippingComisionCost;
}

function displaySelectedPaymentMethod() {
    const selectedRadio = Array.from(document.getElementsByName('payment-method'))
        .find(radioInput => radioInput.checked)

    // Show the name of the selected payment method
    document.getElementById('display-pay-method').innerHTML = selectedRadio.labels[0].innerHTML;

}

function checkAndDisplayPaymentValidationFeedback() {
    const paymentOptionSelection = Array.from(document.getElementsByName('payment-method')).find(radioInput => radioInput.checked);
    const paymentModalError = document.getElementById('display-pay-method-error');

    let inputCardNumber = document.getElementById('credit-card-number');
    let inputCardSecNumber = document.getElementById('credit-card-sec-code');
    let inputCardExpDate = document.getElementById('credit-card-expire-date');

    let inputBankNumber = document.getElementById('bank-account-number');

    if (paymentOptionSelection !== undefined
        && inputCardNumber.checkValidity()
        && inputCardSecNumber.checkValidity()
        && inputCardExpDate.checkValidity()
        && inputBankNumber.checkValidity()) {
        paymentModalError.classList.remove('invalid-feedback-custom-show');
        return true;
    } else {
        paymentModalError.classList.add('invalid-feedback-custom-show');
        return false;
    }
}

function managePaymentInputs() {
    let selectedRadio = Array.from(document.getElementsByName('payment-method'))
        .find(radioInput => radioInput.checked)

    // Disable or enable form-controls needed for the selected type of payment
    let inputCardNumber = document.getElementById('credit-card-number');
    let inputCardSecNumber = document.getElementById('credit-card-sec-code');
    let inputCardExpDate = document.getElementById('credit-card-expire-date');

    let inputBankNumber = document.getElementById('bank-account-number');

    if (selectedRadio.id === "payment-credit-card") {
        inputCardNumber.disabled = false;
        inputCardSecNumber.disabled = false;
        inputCardExpDate.disabled = false;
        inputBankNumber.disabled = true;

        inputCardNumber.required = true;
        inputCardSecNumber.required = true;
        inputCardExpDate.required = true;
        inputBankNumber.required = false;
    } else if (selectedRadio.id === "payment-bank-account") {
        inputCardNumber.disabled = true;
        inputCardSecNumber.disabled = true;
        inputCardExpDate.disabled = true;
        inputBankNumber.disabled = false;

        inputCardNumber.required = false;
        inputCardSecNumber.required = false;
        inputCardExpDate.required = false;
        inputBankNumber.required = true;
    }
}

// Get this user's cart from locally stored cart's data
function loadAndShowCartArticles() {
    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));

    currentUserCart = locallyStoredCarts[userID]; // Return the Cart matching the user ID, and get the first element
    showArticles();
    updateCosts();
}

// Update local stored cart articles if count is changed for an article!
function updateCantAndShowArticles(event) {
    let artIdToModify = parseInt(event.target.getAttribute('data-prod-id')) || undefined;
    let newArticleCant = event.target.value;

    if (event.target.type.toLowerCase() != 'number' || artIdToModify == undefined) return; // Only take numeric inputs

    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));
    let regExp = /^[1-9]\d*$/g; // Regular expression to test() true only for numeric positive values

    if (!regExp.test(newArticleCant)) { // Check for valid inputs and set to 1 if wrong
        event.target.value = 1;
        newArticleCant = 1;
    }

    let articleID = locallyStoredCarts[userID].articles.findIndex(art => art.id === artIdToModify)
    locallyStoredCarts[userID].articles[articleID].count = newArticleCant;
    localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts))

    loadAndShowCartArticles();
}

function deleteArticle(element) {
    let artIdToDelete = parseInt(element.getAttribute('data-prod-id')); // ID of the selected article
    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));

    let articleIndex = locallyStoredCarts[userID].articles.findIndex(art => art.id === artIdToDelete); // Finding article to delete index on Cart Articles Array

    if (articleIndex >= 0) { // Check if the article actually is part of the User's cart
        locallyStoredCarts[userID].articles.splice(articleIndex, 1); // Remove the article from the given index
        // Update LocalStorage
        localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts))
    } else {
        alert('Hubo un error al eliminar este artículo');
    }

    loadAndShowCartArticles();
}

function updateCarts(remoteCart) { // Load API-fetched Cart into local storage
    if (remoteCart === {} || remoteCart.articles?.length === 0) return; // Check for valid data and exit if not valid

    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));
    if (locallyStoredCarts === null) { // Declare cart obj container if localStorage doesn't already exist
        locallyStoredCarts = {};
    }

    if (locallyStoredCarts[userID] === undefined) { // Store user's cart if doesn't already exist
        locallyStoredCarts[userID] = remoteCart;
    } else { // Update user Cart Articles using Cart served by API
        for (const remoteArti of remoteCart.articles) {
            if (locallyStoredCarts[userID].articles.every(localArti => localArti.id != remoteArti.id)) {
                locallyStoredCarts[userID].articles.push(remoteArti);
            }
        }
    }
    localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts));
    loadAndShowCartArticles();
}

document.addEventListener("DOMContentLoaded", function (e) {
    showUser();

    getJSONData(CART_INFO_URL + userID + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            updateCarts(resultObj.data);
        } else {
            alert("No se pudo obtener la lista de productos.\n" + resultObj.data);
        }
    })//.then(loadAndShowCartArticles)// This could be illegal :O

    // Call update function when CHANGE event triggered on an INPUT
    document.addEventListener("change", (e) => {
        if (e.target.tagName === 'INPUT') {
            updateCantAndShowArticles(e)
        }
    })

    // Manage events for radio input shipping options
    Array.from(document.getElementsByName('shipping-option')).forEach(radioInput => {
        radioInput.addEventListener('change', updateCosts);
    });

    // Manage events for radio input payment methods
    Array.from(document.getElementsByName('payment-method')).forEach(radioInput => {
        radioInput.addEventListener('change', () => {
            managePaymentInputs();
            displaySelectedPaymentMethod();
        });
    });

    // Modal focus input on open
    const paymentOptionsModal = document.getElementById('payment-modal')
    const firstModalInput = document.getElementById('credit-card-number')
    paymentOptionsModal.addEventListener('shown.bs.modal', () => {
        firstModalInput.focus()
    });

    // Form validation events
    paymentOptionsModal.addEventListener('hidden.bs.modal', () => {
        checkAndDisplayPaymentValidationFeedback();
    });

    let purchaseForm = document.getElementById('purchase-form');
    purchaseForm.addEventListener('submit', event => {
        // This is a dummy div element to encapsulate form-controls on the payment-modal
        // made to apply .was-validated parent-class on those required controls
        let falsePaymentForm = document.getElementById('dummy-modal-form');

        // 
        checkAndDisplayPaymentValidationFeedback()

        // Stop & Prevent Submittion if Form is not validated
        if (!checkAndDisplayPaymentValidationFeedback() || !purchaseForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            // Stop & Prevent Submittion anyway :P (testing)
            event.preventDefault();
            event.stopPropagation();

            // Show success alert
            document.getElementById('alert-purchase-success').classList.add('show');
        }

        falsePaymentForm.classList.add('was-validated');
        purchaseForm.classList.add('was-validated');

    });

});

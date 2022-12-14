const userID = USER_ID;

let currentProduct = {};
let currentProdComments = [];
let allLocalProdComments = [];

forceUserLogin();

function fillZoomedImgModal() { // Fill a Carousel inside a hidden Modal
    let htmlContentToAppend = '';
    let modalContentContainer = document.getElementById('imgCarouselModal').getElementsByClassName('modal-body')[0];
    modalContentContainer.innerHTML = htmlContentToAppend;

    // Begin Carousel structure
    htmlContentToAppend += `
    <div id="carouselZoom" class="carousel slide" data-bs-ride="false" data-bs-touch="true">
        <div class="carousel-indicators">
    `
    if (currentProduct.images.length > 0) { // Check for images of the product
        // Add the first slide INDICATOR of the Carousel
        htmlContentToAppend += `
            <button type="button" data-bs-target="#carouselZoom" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        `
        // Continue to add the rest of the INDICATORS
        for (let i = 1; i < currentProduct.images.length; i++) { // One image is already added, so the cicle starts on index 1
            htmlContentToAppend += `
            <button type="button" data-bs-target="#carouselZoom" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}"></button>
            `
        }
        // Add the first slide PICTURE of the Carousel
        htmlContentToAppend += `
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="${currentProduct.images[0]}" class="d-block w-100" alt="...">
            </div>
            `
        // Continue to add the rest of the PICTURES
        for (let i = 1; i < currentProduct.images.length; i++) {
            htmlContentToAppend += `
            <div class="carousel-item">
                <img src="${currentProduct.images[i]}" class="d-block w-100" alt="...">
            </div>
            `
        }
    }
    // End of the Carousel structure
    htmlContentToAppend += `
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselZoom" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselZoom" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    `

    modalContentContainer.innerHTML = htmlContentToAppend;
}

function fillImgCarousel() { // Fill the image carousel using product Pictures
    let htmlContentToAppend = '';
    let carouselContainer = document.getElementById('prod-images-container');
    carouselContainer.innerHTML = htmlContentToAppend;

    // Begin Carousel structure
    htmlContentToAppend += `
    <div id="carousel" class="carousel slide" data-bs-ride="false" data-bs-touch="true">
    `
    if (currentProduct.images.length > 0) { // Check for images of the product
        // Add the first slide PICTURE of the Carousel
        htmlContentToAppend += `
        <div class="carousel-inner">
            <div class="carousel-item allow-zoom active" data-bs-target="#carouselZoom" data-bs-slide-to="0">
                <img src="${currentProduct.images[0]}" data-bs-toggle="modal" data-bs-target="#imgCarouselModal" class="d-block w-100" alt="...">
            </div>
            `
        // Continue to add the rest of the PICTURES
        for (let i = 1; i < currentProduct.images.length; i++) {
            htmlContentToAppend += `
            <div class="carousel-item allow-zoom" data-bs-target="#carouselZoom" data-bs-slide-to="${i}">
                <img src="${currentProduct.images[i]}" data-bs-toggle="modal" data-bs-target="#imgCarouselModal" class="d-block w-100" alt="...">
            </div>
            `
        }
    }
    // End of the Carousel structure
    htmlContentToAppend += `
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    `
    // Images thumbnails as Carousel INDICATORS
    htmlContentToAppend += `
    <h6 class="mt-2"><strong>Im??genes ilustrativas</strong></h6>
    `
    if (currentProduct.images.length > 0) {
        htmlContentToAppend += `
        <div class="row flex-row flex-nowrap overflow-auto">
        `
        htmlContentToAppend += `
        <div class="col-3">
            <img src="${currentProduct.images[0]}" data-bs-target="#carousel" data-bs-slide-to="0" aria-current="true" aria-label="Slide 1" title="${currentProduct.name} im??gen ilustrativa 1" alt="${currentProduct.description} im??gen nro. 1" class="border rounded img-fluid">
        </div>
        `
        for (let i = 1; i < currentProduct.images.length; i++) {
            htmlContentToAppend += `
            <div class="col-3">
                <img src="${currentProduct.images[i]}" data-bs-target="#carousel" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}" title="${currentProduct.name} im??gen ilustrativa ${i + 1}" alt="${currentProduct.description} im??gen nro. ${i + 1}" class="border rounded img-fluid">
            </div>
            `
        }
        htmlContentToAppend += `
        </div>`
    }

    carouselContainer.innerHTML = htmlContentToAppend;
}

function showProductInfo() {
    //console.log(currentProduct);
    let htmlContentToAppend = '';
    let titleContainer = document.getElementById('prod-title-container');
    titleContainer.innerHTML = htmlContentToAppend;

    htmlContentToAppend += `
    <h1>${currentProduct.name}</h1>
    <hr>
    `
    titleContainer.innerHTML = htmlContentToAppend;

    htmlContentToAppend = '';
    let infoContainer = document.getElementById('prod-info-container');
    infoContainer.innerHTML = htmlContentToAppend;

    let allCurrentProdComments = currentProdComments.concat(allLocalProdComments.filter(comm => comm.product == localStorage.getItem("prodID")));
    let averageScore = allCurrentProdComments.reduce((acu, comm) => acu + comm.score, 0) / allCurrentProdComments.length; // Score average based on commentaries

    htmlContentToAppend += `
    <p class="fs-6 text-muted">${currentProduct.soldCount} Vendidos</p>
    <p>`
    for (let i = 1; i <= 5; i++) {
        htmlContentToAppend += `
            <span class="fas fa-star${i <= Math.round(averageScore) ? ' checked' : ''}"></span>`
    }
    htmlContentToAppend += `
    ( ${allCurrentProdComments.length} ${currentProdComments.length === 1 ? 'opini??n' : 'opiniones'} )</p>
    <p class="fs-2"><strong>${currentProduct.currency} ${currentProduct.cost}</strong></p>
    <h6><strong>Descripci??n</strong></h6>
    <p class="fs-6">${currentProduct.description}</p>
    <h6><strong>Categor??a</strong></h6>
    <p class="fs-6">${currentProduct.category}</p>
    
    <p class="text-end"><button type="button" class="btn btn-success text-end" id="btn-add-to-cart"><i class="fas fa-regular fa-cart-plus"></i> Agregar</button></p>
    `

    infoContainer.innerHTML = htmlContentToAppend;

    document.getElementById('btn-add-to-cart').addEventListener("click", updateLocalCart); // Add to cart Button Event
    document.getElementById('back-to-listing-category-name').innerHTML = currentProduct.category;
}

function showRelatedProducts() {
    let htmlContentToAppend = '';
    let relatedProdContainer = document.getElementById('related-products-container');
    relatedProdContainer.innerHTML = htmlContentToAppend;

    for (const prod of currentProduct.relatedProducts) {
        htmlContentToAppend += `
        <div onclick="setProdIDAndRedirect(${prod.id})" class="border rounded h-100 m-1 col-6 col-sm-4 col-lg-3">
            <div class="row">
                <img class="p-0" src="${prod.image}" alt="...">
            </div>
            <div class="row m-1 fs-5">
                <p>${prod.name}</p>
            </div>
        </div>
        `
    }
    relatedProdContainer.innerHTML = htmlContentToAppend;
}

function setProdIDAndRedirect(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html";
}

function loadCommentsLocallyStored() {
    if (localStorage.getItem("productCommentaries") != null) {
        allLocalProdComments = JSON.parse(localStorage.getItem("productCommentaries"));
    }
}

function sortCommentsNewerFirst(commentsToSort) {
    commentsToSort.sort(function (a, b) {
        if (a.dateTime > b.dateTime) { return -1; }
        if (a.dateTime < b.dateTime) { return 1; }
        return 0;
    });
    return commentsToSort;
}

function loadAndShowProductComments() {
    let htmlContentToAppend = '';
    let commentsContainer = document.getElementById('comment-list-container');
    commentsContainer.innerHTML = htmlContentToAppend;

    loadCommentsLocallyStored()

    // Concatenate remote stored comments and locally allocated into one new array
    let prodComments = currentProdComments.concat(allLocalProdComments.filter(comm => comm.product == localStorage.getItem("prodID")));
    prodComments = sortCommentsNewerFirst(prodComments);

    for (const comment of prodComments) {
        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
            <div class="col-auto auto-me">
                <p><strong>${comment.user.slice(0, comment.user.search("@"))}</strong> - ${comment.dateTime} -</p>
            </div>
            <div class="col-auto auto-me">
                <p>
                `
        // Add commentary stars
        for (let i = 1; i <= 5; i++) {
            if (i <= comment.score) {
                htmlContentToAppend += `
                <span class="fa fa-star checked"></span>
                `
            } else {
                htmlContentToAppend += `
                <span class="fa fa-star"></span>
                `
            }
        }
        htmlContentToAppend += `
                </p>
            </div>
            </div>
            <div class="row">
                <p>${comment.description}</p>
            </div>
        </div>
        `
    }
    commentsContainer.innerHTML = htmlContentToAppend;
}

function saveCommentsToLocalStore(newCommentary) {
    if (newCommentary != null && newCommentary != {}) {
        allLocalProdComments.push(newCommentary);
        localStorage.setItem("productCommentaries", JSON.stringify(allLocalProdComments));
    }
}

function newCommentary() {
    let commentDescription = document.getElementById('new-comment-description');
    let commentScore = document.getElementById('new-comment-score-select');

    loadCommentsLocallyStored()

    if (commentDescription.value != "") {
        if (parseInt(commentScore.value) > 0 && parseInt(commentScore.value) <= 5) {
            let dateTime = new Date();

            let newComment = {
                product: parseInt(currentProduct.id),
                score: parseInt(commentScore.value),
                description: commentDescription.value,
                user: localStorage.getItem("loggedUser"),
                dateTime: dateTime.toLocaleString("es-US", { year: 'numeric' }) + "-" +
                    dateTime.toLocaleString("es-US", { month: '2-digit' }) + "-" +
                    dateTime.toLocaleString("es-US", { day: '2-digit' }) + " " +
                    dateTime.toLocaleTimeString("en-US", { hour12: false })
                // dateTime:       `${dateTime.getFullYear}-${dateTime.getMonth + 1}-${dateTime.getDate}` + ` ` + 
                //                 `${dateTime.getHours}"${dateTime.getMinutes}:${dateTime.getSeconds}`
            }

            saveCommentsToLocalStore(newComment);
            // Reset new commentaries input
            commentDescription.value = "";
            commentScore.value = 1;
            loadAndShowProductComments();
        } else {
            commentScore.classList.add("is-invalid");
        }
    } else {
        commentDescription.classList.add("is-invalid");
    }
}

function updateLocalCart() {
    if (currentProduct === undefined && userID === undefined) return; // Check for product and user data

    let locallyStoredCarts = JSON.parse(localStorage.getItem('cartArticlesByUsrID'));

    if (locallyStoredCarts === null) { // Declare cart obj container if localStorage doesn't already exist
        locallyStoredCarts = {};
    }

    if (locallyStoredCarts[userID] === undefined) { // Create user's cart if doesn't already exist
        let newCart = {
            user: userID,
            articles: []
        }
        // Store new cart using this user ID
        locallyStoredCarts[userID] = newCart;
    }

    let existingArticle = locallyStoredCarts[userID].articles.find(art => art.id === currentProduct.id);
    if (existingArticle === undefined) {
        let newArticle = {
            id: currentProduct.id,
            name: currentProduct.name,
            count: 1,
            unitCost: currentProduct.cost,
            currency: currentProduct.currency,
            image: currentProduct.images[0] ?? ''
        }
        // Update LocalStorage
        locallyStoredCarts[userID].articles.push(newArticle);
        localStorage.setItem('cartArticlesByUsrID', JSON.stringify(locallyStoredCarts))
    } else {
        alert('Ya tienes este producto en tu carrito');
    }

    // Redirect to cart
    window.location = "cart.html";
}

document.addEventListener("DOMContentLoaded", function (e) {
    showUser();
    // Fetch product commentaries
    getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProdComments = resultObj.data;
            loadAndShowProductComments();
        } else {
            alert("No se pudo obtener los comentarios del producto.\n" + resultObj.data);
        }
    });
    // Fetch product information
    getJSONData(PRODUCT_INFO_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProduct = resultObj.data;
            showProductInfo();
            fillZoomedImgModal(); // Fill the modal with carousel with the product images
            fillImgCarousel(); // Fill the modal with carousel with the product images
            showRelatedProducts();
        } else {
            alert("No se pudo obtener informaci??n del producto.\n" + resultObj.data);
        }
    });

    // New commentary event and style changer
    document.getElementById('btn-send-commentary').addEventListener('click', newCommentary);
    document.getElementById('new-comment-description').addEventListener("input", function () {
        document.getElementById('new-comment-description').classList.remove("is-invalid");
    });
    document.getElementById('new-comment-score-select').addEventListener("input", function () {
        document.getElementById('new-comment-score-select').classList.remove("is-invalid");
    });

    // Back to listing event
    document.getElementById('btn-back-product-list').addEventListener("click", (e) => window.location = "products.html");
    document.getElementById('btn-back-category-list').addEventListener("click", (e) => window.location = "categories.html");
});

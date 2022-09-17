let currentProduct = {};
let currentProdComments = [];
let currentLocalProdComments = [];

function fillZoomedImgModal () { // Fill a Carousel inside a hidden Modal
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
        // Add the first slide PICTURES of the Carousel
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

function showProductInfoAndPictures () {
    //console.log(currentProduct);
    let htmlContentToAppend = '';
    let infoContainer = document.getElementById('prod-info-container');
    infoContainer.innerHTML = htmlContentToAppend;

    htmlContentToAppend += `
    <h2 class="pt-4 pb-4">${currentProduct.name}</h2>
    <hr>
    <h6><strong>Precio</strong></h6>
    <p>${currentProduct.currency} ${currentProduct.cost}</p>
    <h6><strong>Descripción</strong></h6>
    <p>${currentProduct.description}</p>
    <h6><strong>Categoría</strong></h6>
    <p>${currentProduct.category}</p>
    <h6><strong>Cantidad de vendidos</strong></h6>
    <p>${currentProduct.soldCount}</p>
    <h6><strong>Imágenes ilustrativas</strong></h6>
    `;

    if (currentProduct.images.length > 0) {
        htmlContentToAppend += `
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        `;
        for ( let i = 0; i < currentProduct.images.length; i++ ) {
            htmlContentToAppend += `
            <div class="col">
                <img src="${currentProduct.images[i]}" data-bs-toggle="modal" data-bs-target="#imgCarouselModal" title="${currentProduct.name} imágen ilustrativa ${i + 1}" alt="${currentProduct.description} imágen nro. ${i + 1}" class="border rounded img-fluid">
            </div>
            `;
        }
        htmlContentToAppend += `</div>`;
    }
    infoContainer.innerHTML = htmlContentToAppend;
    fillZoomedImgModal(); // Fill the modal with carousel with the product images
}

function showRelatedProducts () {
    let htmlContentToAppend = '';
    let relatedProdContainer = document.getElementById('related-products-container');
    relatedProdContainer = htmlContentToAppend;

    htmlContentToAppend += ``

}

function loadCommentsLocallyStored() {
    if ( localStorage.getItem("productCommentaries") != null ) {
        currentLocalProdComments = JSON.parse(localStorage.getItem("productCommentaries"));
    }
}

function sortCommentsNewFirst(commentsToSort){
    commentsToSort.sort(function(a, b) {
        if ( a.dateTime > b.dateTime ){ return -1; }
        if ( a.dateTime < b.dateTime ){ return 1; }
        return 0;
    });
    return commentsToSort;
}

function loadAndShowProductComments () {
    let htmlContentToAppend = '';
    let commentsContainer = document.getElementById('comment-list-container');
    commentsContainer.innerHTML = htmlContentToAppend;

    loadCommentsLocallyStored()
    // Concatenate remote stored comments and locally allocated into one new array
    let prodComments = currentProdComments.concat(currentLocalProdComments.filter(comm => comm.product == localStorage.getItem("prodID")));
    prodComments = sortCommentsNewFirst(prodComments);

    for (const comment of prodComments) {
        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
                <p><strong>${comment.user}</strong> - ${comment.dateTime} - 
                `
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
            <div class="row">
                <p>${comment.description}</p>
            </div>
        </div>
        `
    }
    commentsContainer.innerHTML = htmlContentToAppend;
}

function saveCommentsToLocalStore(newCommentary) {
    if ( newCommentary != null && newCommentary != {} ) {
        currentLocalProdComments.push(newCommentary);
        localStorage.setItem("productCommentaries", JSON.stringify(currentLocalProdComments));
    }
}

function newCommentary() {
    let commentDescription = document.getElementById('new-comment-description');
    let commentScore = document.getElementById('new-comment-score-select');
    let localStoredComments = []

    loadCommentsLocallyStored()
    localStoredComments = currentLocalProdComments;

    if ( commentDescription.value != "" ) {
        if ( parseInt(commentScore.value) > 0 && parseInt(commentScore.value) <= 5 ) {
            let dateTime = new Date();

            let newComment = {
                product:        parseInt(currentProduct.id),
                score:          parseInt(commentScore.value),
                description:    commentDescription.value,
                user:           localStorage.getItem("loggedUser").toString().slice(0, localStorage.getItem("loggedUser").toString().search("@")),
                dateTime:       dateTime.toLocaleString("es-US", { year: 'numeric' }) + "-" +
                                dateTime.toLocaleString("es-US", { month: '2-digit' }) + "-" +
                                dateTime.toLocaleString("es-US", { day: '2-digit' }) + " " +
                                dateTime.toLocaleTimeString("en-US", { hour12: false })
                // dateTime:       `${dateTime.getFullYear}-${dateTime.getMonth + 1}-${dateTime.getDate}` + ` ` + 
                //                 `${dateTime.getHours}"${dateTime.getMinutes}:${dateTime.getSeconds}`
            }

            saveCommentsToLocalStore(newComment);
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

document.addEventListener("DOMContentLoaded", function(e){
    forceUserLogin();
    showUser();
    // Fetch product information
    getJSONData(PRODUCT_INFO_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok") {
            currentProduct = resultObj.data;
            showProductInfoAndPictures();
            showRelatedProducts();
            return;
        } else {
            alert("No se pudo obtener información del producto.\n" + resultObj.data);
        }
    });
    // Fetch product commentaries
    getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok") {
            currentProdComments = resultObj.data;
            loadAndShowProductComments();
        } else {
            alert("No se pudo obtener los comentarios del producto.\n" + resultObj.data);
        }
    });

    document.getElementById('btn-send-commentary').addEventListener('click', function () {
        newCommentary();
    })
    document.getElementById('new-comment-description').addEventListener("input", function () {
        document.getElementById('new-comment-description').classList.remove("is-invalid");
    })
    document.getElementById('new-comment-score-select').addEventListener("input", function () {
        document.getElementById('new-comment-score-select').classList.remove("is-invalid");
    })
});


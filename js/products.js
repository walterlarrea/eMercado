const ORDER_ASC_BY_COST = "CostAsc";
const ORDER_DESC_BY_COST = "CostDesc";
const ORDER_BY_PROD_RELEVANCE = "Cant.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCost = undefined;
let maxCost = undefined;
let searchBoxValue = undefined;

function showProductsList(){
    let htmlContentToAppend = "";
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;

    for (const product of currentProductsArray) {
        let nameSearchResult = -1;
        let descriptionSearchResult = -1;

        if ( searchBoxValue != undefined ){
            nameSearchResult = product.name.toLowerCase().search(searchBoxValue.toLowerCase());
            descriptionSearchResult = product.description.toLowerCase().search(searchBoxValue.toLowerCase());
        }

        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost)) &&
            ((searchBoxValue == undefined) || (searchBoxValue != undefined && (nameSearchResult >= 0 || descriptionSearchResult >= 0)))) {

            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.image + `" alt="product image" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">` + product.name + ` - ` + product.currency + ` ` + product.cost + `</h4> 
                            <small class="text-muted">`+ product.soldCount + ` vendidos</small> 
                        </div>
                        <p>` + product.description + `</p> 
                    </div>
                </div>
            </div>
            `
        }
    }
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
}

function sortAndShowProducts(sortCriteria){
    currentSortCriteria = sortCriteria;

    if (currentSortCriteria === ORDER_ASC_BY_COST) {
        currentProductsArray.sort(function(a, b) {
            return a.cost - b.cost;
        });
    }else if (currentSortCriteria === ORDER_DESC_BY_COST) {
        currentProductsArray.sort(function(a, b) {
            return b.cost - a.cost;
        });
    }else if (currentSortCriteria === ORDER_BY_PROD_RELEVANCE) {// Order by the amount of sold products in decreasing order
        currentProductsArray.sort(function(a, b) {
            return b.soldCount - a.soldCount;
        });
    }

    showProductsList();
}

document.addEventListener("DOMContentLoaded", function(e){
    forceUserLogin();
    showUser();
    
    // Obtain products list creating url using sistem saved information
    getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok") {
            document.getElementById("cat-name").innerHTML = resultObj.data.catName;
            currentProductsArray = resultObj.data.products;
            showProductsList();
        } else {
            alert("Ha ocurrido un error.\n" + resultObj.data);
        }
    });

    document.getElementById("sortCostAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortCostDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByRelevance").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_RELEVANCE);
    });

    document.getElementById("rangeFilterCost").addEventListener("click", function(){
        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0) {
            minCost = parseInt(minCost);
        } else {
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0) {
            maxCost = parseInt(maxCost);
        } else {
            maxCost = undefined;
        }

        showProductsList();
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList();
    });

    const searchBoxInput = document.getElementById('searchBar');
    searchBoxInput.addEventListener("input", function (e) {
        if ( searchBoxInput.value !== "" ) {
            searchBoxValue = searchBoxInput.value;
        } else {
            searchBoxValue = undefined;
        }
        showProductsList();
    })
});
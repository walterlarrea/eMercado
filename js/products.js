const ORDER_ASC_BY_COST = "AZ";
const ORDER_DESC_BY_COST = "ZA";
const ORDER_BY_PROD_RELEVANCE = "Cant.";
let searchInput = HTMLElement;
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCost = undefined;
let maxCost = undefined;
let searchBox = undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST) {
        result = array.sort(function(a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if ( aCost < bCost ){ return -1; }
            if ( aCost > bCost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST) {
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_RELEVANCE) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList(){
    let htmlContentToAppend = "";
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;

    for (const product of currentProductsArray) {
        let nameResult = -1;
        let descResult = -1;

        if ( searchBox != undefined ){
            nameResult = product.name.toLowerCase().search(searchBox.toLowerCase());
            descResult = product.description.toLowerCase().search(searchBox.toLowerCase());
            console.log(nameResult + " - " + descResult)
        }

        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost)) &&
            ((searchBox == undefined) || (searchBox != undefined && (nameResult >= 0 || descResult >= 0)))) {

            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.image + `" alt="product image" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="mb-1">
                            <h4>` + product.name + ` - ` + product.currency + ` ` + product.cost + `</h4> 
                            <p>` + product.description + `</p> 
                            </div>
                            <small class="text-muted">`+ product.soldCount + ` vendidos</small> 
                        </div>

                    </div>
                </div>
            </div>
            `
            document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
        }
    }
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    showProductsList();
}

document.addEventListener("DOMContentLoaded", function(e){
    forceUserLogin();
    showUser();
    
    getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function(resultObj){        // Obtener url con información del sistema
    //getJSONData(PRODUCTS_URL + "101" + EXT_TYPE).then(function(resultObj){                                      // Obtener url solo para categoría Autos
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

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCost").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
            minCost = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
            maxCost = parseInt(maxCost);
        }
        else{
            maxCost = undefined;
        }

        showProductsList();
    });

    searchInput = document.getElementById('searchBar');
    searchInput.addEventListener("input", function () {
        if ( searchInput.value === "" ) {
            searchBox = undefined;
        } else {
            searchBox = searchInput.value;
        }
        showProductsList();
    })
});
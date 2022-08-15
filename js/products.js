let categoryProdList;

//función que recibe una categoria con lista de productos, y los muestra en pantalla a través el uso del DOM
function showCategoriesList(categoryProd){
    let htmlContentToAppend = "";

    document.getElementById("cat-name").innerHTML = categoryProd.catName;

    for (const product of categoryProd.products) {
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

document.addEventListener("DOMContentLoaded", function(e){
    //getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function(resultObj){        // Obtener url con información del sistema
    getJSONData(PRODUCTS_URL + "101" + EXT_TYPE).then(function(resultObj){                                      // Obtener url solo para categoría Autos
        if (resultObj.status === "ok")
        {
            categoryProdList = resultObj.data;
            showCategoriesList(categoryProdList);
        }
    });
});
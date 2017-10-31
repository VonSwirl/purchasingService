var ProductSupply = require('../models/productsupply.js');
var Product = require('../models/product.js');

function getAllTheSupplierDetailsForASetOfProducts(selectedProduct){
    var productSupplies = [];
    for(var x  in selectedProduct){
           ProductSupply.findById(x).then(function(productsupply){
                console.log('I AM IN HEREEE');
                console.log(productsupply);
                productSupplies.push(productsupply);
           })
    }
    return productSupplies;
}


function getSupplierListForAProduct(productSupplierList){
    for(var t in propName){
        console.log(t);
                        }
}

module.exports = getAllTheSupplierDetailsForASetOfProducts
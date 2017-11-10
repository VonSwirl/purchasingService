var Product = require('../models/product.js');
var ProductDTO = require('../dto/productDTO.js');

/**
 * Gets all the products that the suppliers sell ready to be listed
 */
function getAllProductsAvaliableForPurchase(){
    var promise =  Product.find({}).populate({path: 'suppliersThatStock', match: {inStock : true}}).lean().exec(); 
    return promise;
}

/**
 * This function gets the purchased product ready in a format that the stock service will recognise
 * @param {The ean of the product being purchased} ean 
 * @param {The number purchased of the product} number 
 */
function readyItemForStockUpdate(ean, number){
    return new Promise(function(resolve, reject){
    Product.findOne({Ean : ean}).then(function(item){
        var productDTO = new ProductDTO(item, number);
        resolve(productDTO.jsonVersion);
    }).catch(function(err){
        reject('no such item found');
    })
});
}


module.exports = {getAllProductsAvaliableForPurchase, readyItemForStockUpdate};
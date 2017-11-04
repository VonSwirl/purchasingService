var Product = require('../models/product.js');

function getAllProductsAvaliableForPurchase(){
    var promise =  Product.find({}).populate({path: 'suppliersThatStock', match: {inStock : true}}).lean().exec(); 
    return promise;


}


module.exports = {getAllProductsAvaliableForPurchase};
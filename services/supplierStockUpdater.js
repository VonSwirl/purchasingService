const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Supplier = require('../models/suppliers.js');
var request = require('request');
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');


/**
 * This adds the product to the database along with linked product-supplier details
 * @param {*The product to be added to the database} item 
 * @param {*The supplier details to be linked to the product} supplier 
 */
function addNewProductToDatabase(item, supplier) {
    //First we create a product supply to add to the product 

    var productsupply = new ProductSupply({
        supplierName: supplier,
        price: item.Price,
        Ean: item.Ean,
        inStock: item.InStock
        
    });
    productsupply.save();

    var product = new Product({
        Ean: item.Ean,
        name : item.Name,
       suppliersThatStock : [productsupply._id],
       description : item.Description,
       brandName: item.BrandName,
       categoryName : item.CategoryName
    });

    product.save();
}

/**
 * Add a new product supply 
 * @param {The current productSupply list which links a product with suppliers} currentProductSupplyList 
 * @param {The information held by the supplier about the product they sell} infoOnProductInSupplierBank 
 * @param {The supplier selling the product} supplier 
 */
function addANewProductSupply(currentProductSupplyList, infoOnProductInSupplierBank, supplier) {
    var productsupply = new ProductSupply({
        supplierName: supplier,
        price: infoOnProductInSupplierBank.Price,
        Ean: infoOnProductInSupplierBank.Ean,
        inStock: infoOnProductInSupplierBank.InStock
    });
    productsupply.save();
    currentProductSupplyList.push(productsupply._id);
    return currentProductSupplyList;


}

/**
 * This function updates the product with the new product-supply list details
 * @param {The product unique EAN value} ean 
 * @param {The product supply list to be added to the product} newProductSupplyList 
 */
function updateProductSupplyList(ean, newProductSupplyList){
    Product.findOneAndUpdate({ Ean: ean },
        { suppliersThatStock: newProductSupplyList }, function (err, product) {
            if (err) {
                console.log('i am an error');
            }
        })
}

/**
 * 
 * Checks if the supplier has changed its current price and or has enough stock and updates if needed
 * @param {The database supplierLink for the product} supplierLink 
 * @param {The supplier side information on the product} infoOnProductInSupplierBank 
 */
function updatePriceAndStockLevelOfProductIfNeeded(supplierLink, infoOnProductInSupplierBank){
    if(supplierlink.price != infoOnProductInSupplierBank.Price || supplierlink.inStock != infoOnProductInSupplierBank.InStock){
        ProductSupply.findByIdAndUpdate({ean : supplierlink.Ean}, {price : supplierlink.Price,
        inStock : InStock}, function(err, res){
        });
}
}

/**
 * Retrieves the supplier details held in relation to the product in the database and updates or addes new supplier details as needed 
 * @param {The current details held in the database on the product} currentProduct 
 * @param {The information on the product held in the supplier} infoOnProductInSupplierBank 
 * @param {The supplier name} supplier 
 */
function findCurrentSupplierDetailsOfProductAndUpdate(currentProduct, infoOnProductInSupplierBank, supplier) {
    ProductSupply.findOne({
        supplierName: supplier,
        Ean: currentProduct.Ean
    }).then(function (supplierlink) {
        if (!supplierlink) {
            updateProductSupplyList(currentProduct.Ean, addANewProductSupply(currentProduct.suppliersThatStock, infoOnProductInSupplierBank, supplier));
        }
        else{
              updatePriceAndStockLevelOfProductIfNeeded(supplierlink, infoOnProductInSupplierBank);
        };
    });
}

/**
 * Makes a request to the supplier's api for a list of products
 * @param {The supplier details} supplier 
 */
function makeAnApiRequestToSupplierAndUpdate(supplier){
    request(supplier.api, function(error, response, body){
        updateProductsDbBySupplier(body, supplier.name); 

   });
}

/**
 * Finds all the suppliers in the database and requests and updated product list
 */
function updateDbWithAllSupplierStockDetails(){
    Supplier.find({}).then(function(supplier){
       for(var t = 0; t < supplier.length; t++){
           makeAnApiRequestToSupplierAndUpdate(supplier[t]);
    }
});
}

/**
 * Finds out if we already have the suppliers product in our database, 
 * if not then we request to create one and if we do then we check that our current
 * details on the suppliers costs etc are correct
 * @param {The infomation on the product supplier side} infoOnProductInSupplierBank 
 * @param {The suppliers name} supplier 
 */
function findIfThereIsAlreadyAproductAndRespond(infoOnProductInSupplierBank, supplier){
    Product.findOne({Ean : infoOnProductInSupplierBank.Ean}).then(function(currentProduct){
        if (!currentProduct) {
            addNewProductToDatabase(infoOnProductInSupplierBank, supplier);
        }
        else {
            findCurrentSupplierDetailsOfProductAndUpdate(currentProduct, infoOnProductInSupplierBank, supplier);
            
                }
            } 
        );
    };

/**
 * Parses the api data and runs through the products and updates the database with details as needed
 * @param {The json data retrieved from the suppliers api} datain 
 * @param {The suppliers name} supplier 
 */
function updateProductsDbBySupplier(datain, supplier) {
    try {
        
        var data = JSON.parse(datain);
   
    for (var i = 0; i < Object.keys(data).length; i++) {
        findIfThereIsAlreadyAproductAndRespond(data[i], supplier);
    }; } catch (error) {
        console.log(error);
}}
module.exports = {
    updateProductsDbBySupplier,
    updateDbWithAllSupplierStockDetails
}
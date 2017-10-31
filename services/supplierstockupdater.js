
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Supplier = require('../models/suppliers.js');
var request = require('request');
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');



function addNewProductToDatabase(item, supplier) {

    console.log('ADDING TO THE DATABASE SOMEHTING');

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
       description : item.Description
    });

    product.save();
    console.log('adding new product' + product.name);
}

function addANewProductSupply(currentProductSupplyList, infoOnProductInSupplierBank, supplier) {

    var productsupply = new ProductSupply({
        supplierName: supplier,
        price: infoOnProductInSupplierBank.Price,
        Ean: infoOnProductInSupplierBank.Ean,
        inStock: infoOnProductInSupplierBank.InStock
    });
    productsupply.save();

    currentProductSupplyList.push(productsupply._id);
    console.log('i should have added one to the list');

    console.log(currentProductSupplyList);

    return currentProductSupplyList;


}

function updateProductSupplyList(ean, newProductSupplyList){
    console.log('i am TRYING  to update the supply list!!!');
    Product.findOneAndUpdate({ Ean: ean },
        { suppliersThatStock: newProductSupplyList }, function (err, product) {
            console.log('i am updating product supply list');
            if (err) {
                console.log('i am an error');
            }
        })
}

function findCurrentSupplierDetailsOfProduct(currentProduct, infoOnProductInSupplierBank, supplier) {
    ProductSupply.findOne({
        supplierName: supplier,
        Ean: currentProduct.Ean
    }).then(function (supplierlink) {
        var newProductSupplyList;
        console.log(supplierlink);
        if (!supplierlink) {
            updateProductSupplyList(currentProduct.Ean, addANewProductSupply(currentProduct.suppliersThatStock, infoOnProductInSupplierBank, supplier));
        }
        else{
                if(supplierlink.price != infoOnProductInSupplierBank.Price || supplierlink.inStock != infoOnProductInSupplierBank.InStock){
                    ProductSupply.findByIdAndUpdate({ean : supplierlink.Ean}, {price : supplierlink.Price,
                    inStock : InStock}, function(err, res){
                    });
            }else{
                console.log('no changes to be made');
            }

        };
    });
}

function makeAnApiRequestToSupplierAndUpdate(supplier){
    request(supplier.api, function(error, response, body){
        updateProductsDbBySupplier(body, supplier.name); 

   });
}

function updateDbWithAllSupplierStockDetails(){
    Supplier.find({}).then(function(supplier){
       for(var t = 0; t < supplier.length; t++){
           makeAnApiRequestToSupplierAndUpdate(supplier[t]);
        
    }
    console.log('i am finished with the database');
});
}

function findIfThereIsAlreadyAproductAndRespond(infoOnProductInSupplierBank, supplier){
    Product.findOne({Ean : infoOnProductInSupplierBank.Ean}).then(function(currentProduct){
        if (!currentProduct) {
            addNewProductToDatabase(infoOnProductInSupplierBank, supplier);
            return;
        }
        else {
            console.log('finding current supplier details');
            findCurrentSupplierDetailsOfProduct(currentProduct, infoOnProductInSupplierBank, supplier);
            return;
            
        }
        return;
    } 
    );
    };

function updateProductsDbBySupplier(datain, supplier) {

    try {
        
        var data = JSON.parse(datain);
    } catch (error) {
       console.log('error caught here') ;
       console.log(error);
       console.log(datain);
       return;
    }
    for (var i = 0; i < Object.keys(data).length; i++) {
        findIfThereIsAlreadyAproductAndRespond(data[i], supplier);
        
    };

}
module.exports = {
    updateProductsDbBySupplier,
    updateDbWithAllSupplierStockDetails
}
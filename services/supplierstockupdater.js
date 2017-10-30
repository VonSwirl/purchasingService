
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Supplier = require('../models/suppliers.js');
var request = require('request');
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');

function checkAndRetrieveProduct(ean) {

    try {
        Product.find({Ean : ean}).then(function(product){
            return product;
        });
    } catch (error) {
        return null;
        
    }
    
    return null;
}

function addNewProductToDatabase(item, supplier) {
   ProductSupply.create({
        supplierName: supplier,
        price: item.Price,
        Ean: item.Ean,
        inStock: item.InStock
    }, function(prodsup){
        Product.create({
            Ean: item.Ean,
            name: item.Name,
            description: item.Description,
            suppliersThatStock: [prodsup]
        });
    });
        
    
}

function addANewProductSupply(currentProductSupplyList) {
    currentProductSupplyList.push(ProductSupply.create({
        supplierName: supplier,
        price: infoOnProductInSupplierBank.Price,
        Ean: currentProduct.Ean,
        inStock: infoOnProductInSupplierBank.InStock
    }))
    return currentProductSupplyList;


}

function updateProductSupplyList(ean, newProductSupplyList){
    Product.findOneAndUpdate({ Ean: currentProduct.ean },
        { suppliersThatStock: newProductSupplyList }, function (err, product) {
            if (err) {
                console.log('i am an error');
            }
        })
}

function findCurrentSupplierDetailsOfProduct(currentProduct, infoOnProductInSupplierBank, supplier) {
    ProductSupply.find({
        supplierName: supplier,
        Ean: item.Ean
    }).then(function (supplierlink) {
        var newProductSupplyList;
        if (supplierlink == null) {
            updateProductSupplyList(currentProduct.Ean, addANewProductSupply(currentProduct.suppliersThatStock));
        }
        else{
            if(supplierlink.price == infoOnProductInSupplierBank.Price && supplierlink.inStock == infoOnProductInSupplierBank.InStock){
                ProductSupply.findByIdAndUpdate({ean : supplierlink.Ean}, {price : supplierlink.Price,
                inStock : InStock}, function(err, res){
                });
            };

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


function updateProductsDbBySupplier(datain, supplier) {

    try {
        
        var data = JSON.parse(datain);
    } catch (error) {
       console.log('error caught here') ;
       console.log(data);
       return;
    }
    for (var i = 0; i < Object.keys(data).length; i++) {
        var infoOnProductInSupplierBank = data[i];
        console.log(data[i].Ean);
        var currentProduct = checkAndRetrieveProduct(data[i].Ean);
        if (currentProduct == null) {
            addNewProductToDatabase(infoOnProductInSupplierBank, supplier);
        }
        else {
            findCurrentSupplierDetailsOfProduct(currentProduct, infoOnProductInSupplierBank, supplier);
        }

    }

}
module.exports = {
    updateProductsDbBySupplier,
    updateDbWithAllSupplierStockDetails
}
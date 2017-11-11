const assert = require('chai').assert;
const expect = require('chai').expect;
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');
var mongoose = require('mongoose');
var config = require('../config');
var readyItemForStock = require('../services/productSearchService.js').readyItemForStockUpdate;
var listStock = require('../services/productSearchService.js').getAllProductsAvaliableForPurchase;
var random = Math.random(100000);

var testProduct = new Product({name : "testing" + random, Ean : random, 
                            brandName : "bla", categoryName : "cat" , 
                            suppliersThatStock : 
                                        [new ProductSupply({supplierName : "fakesupplier",
                                                            price : 8, 
                                                            Ean : random,
                                                            inStock : true})],
                            stockNeededForOrders : [{orderNo : "fakeOrder1", number : 10}],
                            totalStockNeededForOrders : 10})
describe('MODULE - PRODUCT SEARCH SERVICE', function(done){


describe('Ready item for stock service test', function(done){

    it('check that correct product details are being passed to stock service', function(done){

        testProduct.save().then(function(){
            var number = 10;
            var result = readyItemForStock(testProduct.Ean, number);
            result.then(function(item){
                expect(item.ean).to.be.equal(testProduct.Ean);
                expect(item.category).to.be.equal(testProduct.category);
                expect(item.brand).to.be.equal(testProduct.brandName);
                expect(item.description).to.be.equal(testProduct.description);
                expect(item.numberRequired).to.be.equal(number);
                done();
            })
                .catch(function(err){
                    assert.isNotOk(err, 'promise error');})
    })})

    it('testing a non existent product trying to be readied', function(done){
        readyItemForStock("false ean", 100).then(function(result){
        }).catch(function(err){
            expect(err).to.be.equal("no such item found");
            done();
        })
    })
    

    it('testing a non number being passed in', function(done){
        readyItemForStock("false ean", "not a number").then(function(result){
        }).catch(function(err){
            expect(err).to.be.equal("incorrect incoming");
            done();
        })})

        it('testing a number equal to zero being passed in', function(done){
            readyItemForStock("false ean", 0).then(function(result){
            }).catch(function(err){
                expect(err).to.be.equal("incorrect incoming");
                done();
            })})


})    

   
/* describe('Testing product list functionality', function(done){

    it('checking that there are no products that are not in stock', function(done){
        listStock().then(function(results){
            console.log(results, " these are the results");
            results.forEach(element => {
               expect(element.inStock).to.be.equal(true);
            });
            done();
        })

    })

}); */

})
const assert = require('chai').assert;
const expect = require('chai').expect;
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');
var mongoose = require('mongoose');
var config = require('../config');
var updateStockRequiredAfterOrderFunction = require('../services/stockRequiredToFulfilOrderUpdater.js').updateStockRequiredAfterOrderPlaced;

//mongoose.connect(config.testDatabaseURL);
//mongoose.Promise = global.Promise;
var random = Math.random(1000000);
var random2 = Math.random(100000);

var testProduct = new Product({name : "testing" + random, Ean : random, 
                                    brandName : "bla", categoryName : "cat" , 
                                    suppliersThatStock : 
                                             [new ProductSupply({supplierName : "fakesupplier",
                                                     price : 8, 
                                                       Ean : random,
                                                    inStock : true})],
                                    stockNeededForOrders : [{orderNo : "fakeOrder1", number : 10}],
                                totalStockNeededForOrders : 10});
 
var testProduct2 = new Product({name : "testing" + random2, Ean : (random2), 
brandName : "bla", categoryName : "cat" , 
suppliersThatStock : 
         [new ProductSupply({supplierName : "fakesupplier2",
                 price : 8, 
                   Ean : random,
                inStock : true})],
stockNeededForOrders : [{orderNo : "fakeOrder2", number : 11}],
totalStockNeededForOrders : 11});

                                
describe('testing UpdateStockRequiredAfterOrder function', function(done){
    it('testing adding a complex product that will be used as a fake in the tests', function(done){
        testProduct.save().then(function(product){
            assert.equal(testProduct.isNew, false);
            done();
        });
    });

    it('testing removing the less than needed after a purchase', function(done){
        var currentNumberInFirstOrderLeftToFulfil = testProduct.stockNeededForOrders[0].number;
        var numberToBeTakenOut = currentNumberInFirstOrderLeftToFulfil -1;
        updateStockRequiredAfterOrderFunction(testProduct.Ean, numberToBeTakenOut).then(function(p, err){
            if(err){
                assert.isNotOk(err, 'function error');
            }else{
            Product.findOne({Ean : testProduct.Ean}).then(function(product){
                expect(product.totalStockNeededForOrders).to.be.equal(1);
                assert(product.stockNeededForOrders[0].number === 1, 'correct stock left in order');
                done();
            }).catch(function(err){
                    assert.isNotOk(err, 'promise error');
                    done();
                });
            }}).catch(function(err){
                assert.isNotOk(err, 'promise error');
                done(); 
            })});
    });

    it('testing removing all the stock needed for an order of a product', function(done){
        testProduct2.save().then(function(product){
            assert.equal(testProduct2.isNew, false);
        var removedNumber = testProduct2.stockNeededForOrders[0].number;
        var sizeOfArrayOfOutstandingOrders = testProduct2.stockNeededForOrders.length;
        updateStockRequiredAfterOrderFunction(testProduct2.Ean, removedNumber).then(function(p, err){
            if(err){
                assert.isNotOk(err, 'function error');
            }else{
            Product.findOne({Ean : testProduct2.Ean}).then(function(product){
                expect(product.totalStockNeededForOrders).to.be.equal(0);
                expect(product.stockNeededForOrders.length).to.be.equal(0);
                done();
            }).catch(function(err){
                    assert.isNotOk(err, 'promise error');
                    done();
                });
            }}).catch(function(err){
                assert.isNotOk(err, 'promise error');
                done(); 
            })});});
    
  
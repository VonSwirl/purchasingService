const assert = require('chai').assert;
const expect = require('chai').expect;
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');
var mongoose = require('mongoose');
var config = require('../config');
var updateStockRequiredAfterOrderFunction = require('../services/stockRequiredToFulfilOrderUpdater.js').updateStockRequiredAfterOrderPlaced;
var addStockRequiredToProduct = require('../services/stockRequiredToFulfilOrderUpdater.js').addStockRequiredToProduct;

//mongoose.connect(config.testDatabaseURL);
//mongoose.Promise = global.Promise;
var random = Math.random(1000000);
var random2 = Math.random(100000);
var random3 = Math.random(100000);
var random4 =  Math.random(100000);
var random5 =  Math.random(100000);
var random6 =  Math.random(100000);

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

 var testProduct3 = new Product({name: "testingErrors" + random3, Ean : random3, brandName  :"bla", categoryName : "cat"});                               
 var testProduct4 = new Product({name: "testing" + random4, Ean : random4, brandName  :"bla", categoryName : "cat"}); 
 var testProduct5 = new Product({name: "testing" + random5, Ean : random5, brandName  :"bla", categoryName : "cat",stockNeededForOrders : [{orderNo : "fakeOrder3", number : 11}] }); 
 var testProduct6 = new Product({name: "testing" + random6, Ean : random6, brandName  :"bla", categoryName : "cat",stockNeededForOrders : [{orderNo : "fakeOrder4", number : 11}] }); 

describe('MODULE - StockRequiredToFulfilOrderUpdater ', function(done){

                            
describe('Testing UpdateStockRequiredAfterOrder function', function(done){

    it('Testing removing the less than needed after a purchase', function(done){
            testProduct.save().then(function(product){
                assert.equal(testProduct.isNew, false);
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
            })});});});

    it('Testing removing all the stock needed for an order of a product', function(done){
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


            it('Testing no stock is removed when there are no outstanding stock demands', function(done){
                testProduct3.save().then(function(product){
                    assert.equal(testProduct3.isNew, false);
                updateStockRequiredAfterOrderFunction(testProduct3.Ean, 1).then(function(p, err){
                    if(err){
                        assert.isNotOk(err, 'function error');
                    }else{
                    Product.findOne({Ean : testProduct2.Ean}).then(function(product){
                        expect(product.totalStockNeededForOrders).to.be.equal(0);
                        done();
                    }).catch(function(err){
                            assert.isNotOk(err, 'promise error');
                            done();
                        });
                    }}).catch(function(err){
                        assert.isNotOk(err, 'promise error');
                        done(); 
                    })});});
    describe('Testing addStockRequiredToProduct', function(done){
            it('Error returned if no product exists', function(done){
                addStockRequiredToProduct("bla", "blo", 4).then(function(val, error){
                    expect(error).to.be.equal("no product found");
                    done();
                }).catch(function(err){
                    expect(err).to.be.equal("no product found");
                    done();
                });})

            it('Adding a new stock order requirement that does not already exist',
                function(done){
                    testProduct4.save().then(function(product){
                        assert.equal(testProduct4.isNew, false);
                    addStockRequiredToProduct("fake order made1", testProduct4.Ean, 3).then(function(p, err){
                        if(err){
                            assert.isNotOk(err, 'function error');
                        }else{
                        Product.findOne({Ean : testProduct4.Ean}).then(function(product){
                            expect(product.totalStockNeededForOrders).to.be.equal(3);
                            expect(product.stockNeededForOrders[0].orderNo).to.be.equal("fake order made1");
                            done();
                        }).catch(function(err){
                                assert.isNotOk(err, 'promise error');
                                done();
                            });
                        }}).catch(function(err){
                            assert.isNotOk(err, 'promise error');
                            done(); 
                        })});});

            it('Adding a new stock order requirement that already has outstanding orders',
                        function(done){
                            var startingNumber = testProduct5.totalStockNeededForOrders;
                            var numberToAdd = 3;
                            testProduct5.save().then(function(product){
                                assert.equal(testProduct5.isNew, false);
                            addStockRequiredToProduct("fake order made2", testProduct5.Ean, numberToAdd).then(function(p, err){
                                if(err){
                                    assert.isNotOk(err, 'function error');
                                }else{
                                Product.findOne({Ean : testProduct5.Ean}).then(function(product){
                                    expect(product.totalStockNeededForOrders).to.be.equal(numberToAdd + startingNumber);
                                    expect(product.stockNeededForOrders[1].orderNo).to.be.equal("fake order made2");
                                    expect(product.stockNeededForOrders[1].number).to.be.equal(numberToAdd);
                                    done();
                                }).catch(function(err){
                                        assert.isNotOk(err, 'promise error');
                                        done();
                                    });
                                }}).catch(function(err){
                                    assert.isNotOk(err, 'promise error');
                                    done(); 
                                })});});            
               it('Adding a new stock order requirement that already has outstanding orders with the same order number',
                                function(done){
                                    var startingNumber = testProduct6.totalStockNeededForOrders;
                                    var startingOrderValue = testProduct6.stockNeededForOrders[0]["number"];
                                    var numberToAdd = 3;
                                    testProduct6.save().then(function(product){
                                        assert.equal(testProduct6.isNew, false);
                                    addStockRequiredToProduct(testProduct6.stockNeededForOrders[0]["orderNo"], testProduct6.Ean, numberToAdd).then(function(p, err){
                                        if(err){
                                            assert.isNotOk(err, 'function error');
                                        }else{
                                        Product.findOne({Ean : testProduct6.Ean}).then(function(product){
                                            expect(product.totalStockNeededForOrders).to.be.equal(numberToAdd + startingNumber);
                                            expect(product.stockNeededForOrders[0]["number"]).to.be.equal(numberToAdd + startingOrderValue);
                                            done();
                                        }).catch(function(err){
                                                assert.isNotOk(err, 'promise error');
                                                done();
                                            });
                                        }}).catch(function(err){
                                            assert.isNotOk(err, 'promise error');
                                            done(); 
                                        })});});            
        
            })
    
                })
    
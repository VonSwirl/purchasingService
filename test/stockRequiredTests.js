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

var testProduct = new Product({name : "testing" + random, Ean : random, 
                                    brandName : "bla", categoryName : "cat" , 
                                    suppliersThatStock : 
                                             [new ProductSupply({supplierName : "fakesupplier",
                                                     price : 8, 
                                                       Ean : random,
                                                    inStock : true})],
                                    stockNeededForOrders : [{orderNo : "fakeOrder1", number : 10}],
                                totalStockNeededForOrders : 10});
                                
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
                assert(product.totalStockNeededForOrders === 1, 'correct total stock');
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

  
/*     const ProductSchema = new Schema({
        Ean: {type : String, required : true},
        name: {type : String, required : true},
        description: String,
        brandName: {type : String, required : true},
        categoryName: {type : String, required : true},
        suppliersThatStock: [{type: mongoose.Schema.Types.ObjectId, ref: 'productsupply'}],
        stockNeededForOrders : [{orderNo : String, number : Number}],
        totalStockNeededForOrders : {type : Number, default : 0}
    });
    const ProductSupplySchema = new Schema({
        supplierName: {required : true , type : String},
        price: {required : true , type : Number},
        Ean: {required : true , type : String},
        inStock:{required : true , type : Boolean}
    }); */
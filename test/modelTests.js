const assert = require('chai').assert;
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');
var mongoose = require('mongoose');
var config = require('../config');


mongoose.connect(config.databaseURL);
mongoose.Promise = global.Promise;
var random = Math.random(1000000);


var testProduct = new Product({name : "test" + random, Ean : random, brandName: "boo", categoryName : "cat"  });
var testProductSupply = new ProductSupply({supplierName : "testSupplier" , Ean : random, price: 9.99, inStock : true  });

describe('MODULE - DATABASE CONNECTIONS', function(done){


describe(' Testing products schema', function(done) {
    
    it('Testing a product correctly being saved to the products database', function(done) {
        testProduct.save().then(function(){
            assert.equal(testProduct.isNew, false);
            done();
        });
        ;});

    it('Testing that the saved object can be pulled back out of the database', function(done){
        Product.find({Ean : random}).then(function(object, err){
            if(!err && object != null){
                done();
            }
        });
    });
    });
 describe('Testing products supply schema', function(done) {
        it('Testing a product supply correctly being saved to the product supply database', function(done) {
            testProductSupply.save().then(function(){
                assert.equal(testProductSupply.isNew, false);
                done();
            });
            ;});
    
        it('Testing that the saved object can be pulled back out of the database', function(done){
            ProductSupply.find({Ean : random, supplierName : "testSupplier"}).then(function(object, err){
                if(!err && object != null){
                    done();
                }
            });
        });
        });

    })
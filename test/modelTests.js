const assert = require('chai').assert;
const Product = require('../models/product.js');
var mongoose = require('mongoose');
var config = require('../config');


mongoose.connect(config.testDatabaseURL);
mongoose.Promise = global.Promise;

var testProduct = new Product({name : "testname", Ean : "1234", brandName: "boo", categoryName : "cat"  });

describe('savingProducts', function(done) {
    
    it('testing a product correctly being saved to the products database', function(done) {
        testProduct.save().then(function(){
            assert.equal(testProduct.isNew, false);
            done();
        });
        ;});

        it('testing a product correctly being saved to the products database', function(done) {
            testProduct.save().then(function(){
                assert.equal(testProduct.isNew, false);
                done();
            });
            ;});


    });

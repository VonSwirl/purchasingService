const assert = require('chai').assert;
const expect = require('chai').expect;
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');
const Supplier = require('../models/suppliers.js');
var mongoose = require('mongoose');
var config = require('../config');
var rewire = require('rewire');
var addNewProductFunction = require('../services/supplierStockUpdater').addNewProductToDatabase;
var apiRequestSupplier = require('../services/supplierStockUpdater').apiRequestSupplier;
var supplierStockUpdater = rewire('../services/supplierStockUpdater');
var sinon = require('sinon');
var nock = require('nock')
require('sinon-mongoose');


var random = Math.random(100000);

var testProduct = {'Description' : "i am a test product", 'Name' : "test" + random, 'Ean' : random, 'BrandName': "boo", 'CategoryName' : "cat" , 'Price' : 10.99, 'InStock' : true };
describe('MODULE - SUPPLIER UPDATE TESTS', function(done){
  var findStub = sinon.stub(Supplier, "find").resolves(["supplier1", "supplier2"]);

  describe('Testing updating DB with Supplier Details', function(done){
      it('Testing the correct number of calls to the supplier update api', function(done){ 
       var fake = function(){return true};
       var stub =  sinon.stub(supplierStockUpdater, "makeAnApiRequestToSupplierAndUpdate").callsFake(fake);
       var promise = supplierStockUpdater.updateDbWithAllSupplierStockDetails();
       promise.then(function(res){ 
          expect(stub.callCount).to.be.equal(2);
          stub.restore();
          done();
      })
  })

  it('Testing a non-existent supplier throws error', function(done){ 
    var stub =  sinon.stub(supplierStockUpdater, "makeAnApiRequestToSupplierAndUpdate").throws();
    var promise = supplierStockUpdater.updateDbWithAllSupplierStockDetails();
    promise.then(function(res){ 
        assert(res, null);
   }).catch(function(err){
    stub.restore();
    done();
   })
})


})


 describe('Testing making an api request to supplier', function(done){
    it('Testing incorrect url', function(done){
        var spy = sinon.spy(supplierStockUpdater, "updateProductsDbBySupplier");
        supplierStockUpdater.makeAnApiRequestToSupplierAndUpdate({"api": "wrong", "name": "wronger"}).then(function(res){
        }).catch(function(err){
            expect(spy.callCount).to.be.equal(0);
            done();
        })
    })

    it('Testing a rejected call back from api', function(done){
        nock('http://www.testing.com').get('/').reply(200, 'something strange');
        supplierStockUpdater.makeAnApiRequestToSupplierAndUpdate({"api" : "http://www.testing.com", "name": "bla" }).then(function(res){
            console.log(res, "actually in here");

            done();
        }).catch(function(err){
            console.log(err, " this is an error");
            done();
        })

    })
 }) 

  describe('Tesing adding a new product to a database', function(done){
    it('adding a correctly formatted product', function(done){
        addNewProductFunction(testProduct, 'tesco').then(function(){
            Product.findOne({Ean : testProduct.Ean}).then(function(product){
                expect(product.name).to.be.equal(testProduct['Name']);
                expect(product.categoryName).to.be.equal(testProduct.CategoryName);
                expect(product.description).to.be.equal(testProduct.Description);
                expect(product.suppliersThatStock.length).to.be.equal(1);
                ProductSupply.findById(product.suppliersThatStock[0]).then(function(sup){
                expect(sup.inStock).to.be.equal(testProduct.InStock);
                expect(sup.supplierName).to.be.equal('tesco');
                expect(sup.price).to.be.equal(testProduct.Price);
                done();
                })
            })
        })
    });
  })

  

})
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
var priceUpdater = require('../services/supplierStockUpdater').updatePriceAndStockLevelOfProductIfNeeded;
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
        supplierStockUpdater.makeAnApiRequestToSupplierAndUpdate({"api": "wrong", "name": "wronger", "type" : "api"}).then(function(res){
            expect(spy.callCount).to.be.equal(0);
            spy.restore();
            done();
           
        }).catch(function(err){
            console.log('made it here???', res)
        })
    })

    it('Testing a good call back from api', function(done){
        nock('http://www.testing.com').get('/').reply(200, 'good call');
        var fake = function(){return true};
        var stub = sinon.stub(supplierStockUpdater, "updateProductsDbBySupplier").callsFake(fake);
        var promise = supplierStockUpdater.makeAnApiRequestToSupplierAndUpdate({"api" : "http://www.testing.com", "name": "bla" , "type" : "api"})
        promise.then(function(res){
           expect(stub.callCount).to.be.equal(1);
            stub.restore();
            done();
        }).catch(function(err){
            console.log(err, " this is an error");
        })

    })


    it('Testing a bad call back from api', function(done){
        nock('http://www.testing1.com').get('/').reply(500, 'bad call');
        var fake = function(){return true};
        var stub = sinon.stub(supplierStockUpdater, "updateProductsDbBySupplier").callsFake(fake);
        supplierStockUpdater.makeAnApiRequestToSupplierAndUpdate({"api" : "http://www.testing1.com", "name": "bla" }).then(function(res){
            expect(stub.callCount).to.be.equal(0);
            done();
        }).catch(function(err){
            console.log(err, " this is an error");
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

/* 
  decribe('Testing updating the price and stock level of an existing product', function(done){
      var dummyCurSup = {'price' : testProduct.price, 'inStock' : testProduct.inStock};
      var dummyNewSup = {'price' : 11, 'inStock' : true};
      var findStub = sinon.stub(ProductSupply, "findByIdAndUpdate").resolves({'price' : 11, 'inStock' :true});
      it('Stock level being updated', function(done){
        priceUpdater(dummyCurSup, dummyNewSup).then(function(res,err){
            expect(res.price).to.be.equal(dummyNewSup.price);
            expect(res.inStock).to.be.equal(dummyNewSup.inStock);
        })
      })
  })
 */

})
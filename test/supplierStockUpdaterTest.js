
const assert = require('chai').assert;
const expect = require('chai').expect;
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');
const Supplier = require('../models/suppliers.js');
var mongoose = require('mongoose');
var config = require('../config');
var addNewProductFunction = require('../services/supplierStockUpdater').addNewProductToDatabase;
var updateDbWithAllSupplierStockDetails = require('../services/supplierStockUpdater').updateDbWithAllSupplierStockDetails;
var sinon = require('sinon');
require('sinon-mongoose');


var random = Math.random(100000);

var testProduct = {'Description' : "i am a test product", 'Name' : "test" + random, 'Ean' : random, 'BrandName': "boo", 'CategoryName' : "cat" , 'Price' : 10.99, 'InStock' : true };
describe('MODULE - SUPPLIER UPDATE TESTS', function(done){

  describe('Testing ', function(done){
      sinon.stub(Supplier, "find").resolves(["supplier1", "supplier2"]);
      //sinon.mock(Supplier).expects('find').yields(null, ['testsupplier']);
      //var stub = sinon.stub(this , "makeAnApiRequestToSupplierAndUpdate").callsFake(function(){ console.log('bla')});
      updateDbWithAllSupplierStockDetails();
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
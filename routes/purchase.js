var express = require('express');
var request = require('request');

var router = express.Router();
const Supplier = require('../models/suppliers.js');
const Product = require('../models/product.js');


//gets a list of customers by the custid passed in (or id if they themselves are customers)
router.get('/',function(req, res,next){
    Supplier.find({
    }).then(function(suppliers){
        res.render('viewSuppliers', {supplierlist : suppliers});
    });
});



//I should list all the products from a supplier
router.get('/:id', function(req,res,next){
    Supplier.findOne({ name : req.params.id
    }).then(function(supplier){
        request(supplier.api, function(error, response, body){
            var data = JSON.parse(body);
            Product.updateProductsDatabase(body, "test");
        })
    });
})

router.post('/autopurchase', function(req,res,next){
    res.send('you are purchasing stock');
})

module.exports = router;
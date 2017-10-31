var express = require('express');


var router = express.Router();
const Supplier = require('../models/suppliers.js');
const Product = require('../models/product.js');
const StockUpdater = require('../services/supplierstockupdater.js');


//gets a list of customers by the custid passed in (or id if they themselves are customers)
router.get('/',function(req, res,next){
    Supplier.find({
    }).then(function(suppliers){
        res.render('viewSuppliers', {supplierlist : suppliers});
    });
});


router.get('/updateSupplierStockDetails', function(req,res,next){
    console.log('i am inside the right route');
    StockUpdater.updateDbWithAllSupplierStockDetails();
    res.send('complete');
})
router.post('/autopurchase', function(req,res,next){
    res.send('you are purchasing stock');
})

module.exports = router;
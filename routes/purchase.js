var express = require('express');


var router = express.Router();
const Supplier = require('../models/suppliers.js');
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');
const StockUpdater = require('../services/supplierStockUpdater.js');
const StockDetailGrabber = require('../services/supplierStockDetailGrabber.js');



//gets a list of customers by the custid passed in (or id if they themselves are customers)
router.get('/',function(req, res,next){
    Supplier.find({
    }).then(function(suppliers){
        res.render('viewSuppliers', {supplierlist : suppliers});
    });
});

router.get('/chooseSupplier', function(req, res,next){
    for(var propName in req.query){
        if(req.query.hasOwnProperty(propName)){
            console.log(propName);
            if(req.query[propName]){
                var productSupplies = [];
                console.log(propName);
                ProductSupply.find({Ean : propName}).then(function(supplier){
                    console.log(supplier);
                });
                }
            }
        }
        res.send('finished');
})


router.get('/updateSupplierStockDetails', function(req,res,next){
    StockUpdater.updateDbWithAllSupplierStockDetails();

    Product.find({}).populate({path: 'suppliersThatStock', match: {inStock : true}}).lean().exec(function (err, product) {
        res.render('viewProducts.pug', {productList : product});
    });
});

router.post('/autopurchase', function(req,res,next){
    res.send('you are purchasing stock');
})

module.exports = router;
var express = require('express');


var router = express.Router();
const Supplier = require('../models/suppliers.js');
const Product = require('../models/product.js');
const ProductSupply = require('../models/productsupply.js');
const StockUpdater = require('../services/supplierStockUpdater.js');
const request = require('request');


//gets a list of customers by the custid passed in (or id if they themselves are customers)
router.get('/',function(req, res,next){
    Product.find({}).populate({path: 'suppliersThatStock', match: {inStock : true}}).lean().exec(function (err, product) {
        res.render('viewProducts.pug', {productList : product});
    });
});

router.post('/test', function(req,res,next){

    console.log(req.body);
});

router.get('/submitOrder', function(req,res,next){
    for (var propName in req.query) {
        if (req.query.hasOwnProperty(propName)) {

           
            if (req.query[propName][1] != '' && parseInt(req.query[propName][1]) > 0 && req.query[propName][2] != 'Select Supplier' ) {
                var item = {'name' : req.query[propName][0],
                            'numberRequired' : req.query[propName][1],
                            'ean' : propName,
                            'suppliername' : req.query[propName][2]
                }
                request.post({
                    url : "http://localhost:4000/purchasing/test",
                    body: item,
                    json: true
                });
            }
        }
    }

    res.send('order sucessful page .... I need to be done, in good news, the post was successful');


});


router.put('/updateSupplierStockDetails', function(req,res,next){
    StockUpdater.updateDbWithAllSupplierStockDetails();

});

router.post('/autopurchase', function(req,res,next){
    res.send('you are purchasing stock');
})

module.exports = router;
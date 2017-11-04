var express = require('express');


var router = express.Router();
const Supplier = require('../models/suppliers.js');
const StockUpdater = require('../services/supplierStockUpdater.js');
const request = require('request');
const orderFulfilUpdater = require('../services/stockRequiredToFulfilOrderUpdater.js');
const productLister = require('../services/productListService');
const purchaseDTO = require('../dto/purchaseOrderProductDTO');


/**
 * Gets a list of all the product avaliable for purchase with the suppliers that have them in stock
 */
router.get('/',function(req, res,next){
    productLister.getAllProductsAvaliableForPurchase().then(function(product){
        res.render('viewProducts.pug', {productList : product});
    });
});

router.post('/test', function(req,res,next){
    console.log(req.body);
});



/**
 * Once submit order has been pressed, the stock required is updated and the order sent to admin and stock services
 */
router.get('/submitOrder', function(req,res,next){
    for (var propName in req.query) {
        if (req.query.hasOwnProperty(propName)) {
            if (req.query[propName][1] != '' && parseInt(req.query[propName][1]) > 0 && req.query[propName][2] != 'Select Supplier' ) {
                var item = new purchaseDTO (req.query[propName][0],req.query[propName][1],propName,req.query[propName][2]);
                orderFulfilUpdater.updateStockRequiredAfterOrderPlaced(item.ean, item.numberRequired);

                //here we are posting to the admin service with the details to make the order 
                request.post({
                    url : "http://localhost:4000/purchasing/test",
                    body: item.jsonVersion,
                    json: true
                });
            }
        }
    }
    res.send('order sucessful page .... I need to be done, in good news, the post was successful');
});


/**
 * This method updates the supplier stock details with any recent changes (such as price update)
 */
router.get('/updateSupplierStockDetails', function(req,res,next){
    StockUpdater.updateDbWithAllSupplierStockDetails();
    res.send('complete');
});

/**
 * This method responds a request from the order service when certain items are required to fulfil an order
 */
router.post('/stockRequired', function(req,res,next){
    var items = req.body["itemsRequired"];
    for(var item in items){
        orderFulfilUpdater.addStockRequiredToProduct(req.body["orderid"], items[item]["ean"], items[item]["number"]);
    }
   res.send(req.body);
})

module.exports = router;
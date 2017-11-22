
//import { config } from 'chai/lib/chai';

var express = require('express');
var config = require('../config');
var router = express.Router();
const StockUpdater = require('../services/supplierStockUpdater.js');
const request = require('request');
const orderFulfilUpdater = require('../services/stockRequiredToFulfilOrderUpdater.js');
const productSearcher = require('../services/productSearchService.js');
const purchaseCompletionService = require('../services/purchaseCompletionService.js');


/**
 * Gets a list of all the product avaliable for purchase with the suppliers that have them in stock
 */
router.get('/',function(req, res,next){
    productSearcher.getAllProductsAvaliableForPurchase().then(function(product){
        res.render('viewProducts.pug', {productList : product});
    });
});


/**
 * Once submit order has been pressed, the stock required is updated and the order sent to admin and stock services
 */
router.post('/submitOrder', function(req,res,next){
  purchaseCompletionService.completePurchase(req.body); 
  res.render('orderComplete.pug', {'items' : req.body});
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
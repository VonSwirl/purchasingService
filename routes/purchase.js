
//import { config } from 'chai/lib/chai';

var express = require('express');


var config = require('../config');
var router = express.Router();
const StockUpdater = require('../services/supplierStockUpdater.js');
const request = require('request');
const orderFulfilUpdater = require('../services/stockRequiredToFulfilOrderUpdater.js');
const productSearcher = require('../services/productSearchService.js');
const purchaseDTO = require('../dto/purchaseOrderDTO');


/**
 * Gets a list of all the product avaliable for purchase with the suppliers that have them in stock
 */
router.get('/',function(req, res,next){
    productSearcher.getAllProductsAvaliableForPurchase().then(function(product){
        res.render('viewProducts.pug', {productList : product});
    });
});

function updateAdminWithPurchase(supplierItemPurchases){
    for(var key in supplierItemPurchases){
        if(supplierItemPurchases.hasOwnProperty(key)){
            try{
                request.post({
                   url : config.AdminServicePurchaseURL,
                   body: supplierItemPurchases[key].jsonVersionForPayment,
                   json: true
               });} catch(err){
                   console.log('error with admin service link');
               }

        }
    }
 //here we are posting to the admin service with the details to make the order 

}


function updateStockWithPurchase(ean, number){
    productSearcher.readyItemForStockUpdate(ean, number).then(function(item){
        request.post({
            url : config.stockServiceUpdaterURL,
            body: item.jsonVersion,
            json: true
        });
   

})}

/**
 * Once submit order has been pressed, the stock required is updated and the order sent to admin and stock services
 */
router.post('/submitOrder', function(req,res,next){
    var supplierOrderMap = new Object();
    for (var propName in req.body) {
        if (req.body.hasOwnProperty(propName)) {
            if (req.body[propName][1] != '' && parseInt(req.body[propName][1]) > 0 && req.body[propName][2] != 'Select Supplier' ) {
                var supPrice = JSON.parse(req.body[propName][2]);
                var supplierName = supPrice.name;
                if(!supplierOrderMap[supplierName]){
                    supplierOrderMap[supplierName] = new purchaseDTO(supplierName, propName, req.body[propName][1], supPrice.price);
                }
                else{
                    supplierOrderMap[supplierName].addItems(propName, req.body[propName][1], supPrice.price);
                }
                orderFulfilUpdater.updateStockRequiredAfterOrderPlaced(propName, req.body[propName][1]);
                updateStockWithPurchase(propName, req.body[propName][1]);
            }else{
                delete req.body[propName];
            }
        }
    }
    updateAdminWithPurchase(supplierOrderMap);
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
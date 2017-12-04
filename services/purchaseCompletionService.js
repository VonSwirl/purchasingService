const purchaseDTO = require('../dto/purchaseOrderProductDTO');
const request = require('request');
const orderFulfilUpdater = require('../services/stockRequiredToFulfilOrderUpdater.js');
const PurchaseOrder = require('../models/purchaseorder');
const Product = require('../models/product.js');
const ProductDTO = require('../dto/productDTO.js');
var config = require('../config');


//Runs through the order passed in from the order form and extracts any products that have been selected for purchase 
//Also collects items in the order to update the db as well as collecting items from the same supplier so that 
//The admin service can make a payment
function completePurchase(order){
    var supplierOrderMap = new Object();
    var itemsArray = [];
    var totalOrderCost = 0;
    for (var itemEan in order) {
        if (order.hasOwnProperty(itemEan)) {
            if (order[itemEan][1] != '' && parseInt(order[itemEan][1]) > 0 && order[itemEan][2] != 'Select Supplier' ) {
                var supPrice = JSON.parse(order[itemEan][2]);
                var supplierName = supPrice.name;
                var numberOfParticularItem = order[itemEan][1];
                var itemOrderTotal = calculateOrderCost(supPrice.price, numberOfParticularItem);

                if(!supplierOrderMap[supplierName]){
                    supplierOrderMap[supplierName] = new purchaseDTO(supplierName, itemEan, numberOfParticularItem, itemOrderTotal);
                }
                else{
                    supplierOrderMap[supplierName].addItems(itemEan, numberOfParticularItem, itemOrderTotal);
                }

                itemsArray.push({'Ean' : itemEan, 'Number' : numberOfParticularItem});
                totalOrderCost += itemOrderTotal;
                orderFulfilUpdater.updateStockRequiredAfterOrderPlaced(itemEan, order[itemEan][1]);
                updateStockWithPurchase(itemEan, numberOfParticularItem);
            }else{
                delete order[itemEan];
            }
        }
    }
    addPurchaseOrderToDb(itemsArray, totalOrderCost);
    updateAdminWithPurchase(supplierOrderMap);
}

//Calculates the cost based on the number of items
function calculateOrderCost(price, number){
    return price * number;
}

/**
 * Updates the admin service with the purchase items from a supplier so it can make a payement 
 * @param {The list of items ordered from a particular supplier} supplierItemPurchases 
 */
function updateAdminWithPurchase(supplierItemPurchases){
    for(var key in supplierItemPurchases){
        if(supplierItemPurchases.hasOwnProperty(key)){
            try{
                request.post({
                   url : config.AdminServicePurchaseURL,
                   body: supplierItemPurchases[key].jsonVersionForPayment,
                   json: true
               }, function(error, response, body){
                   if(error){
                       console.log(error);
                   }
               });} catch(err){
                   console.log('error with admin service link');
               }

        }
    }
 //here we are posting to the admin service with the details to make the order 

}

//Adds the order to the db
function addPurchaseOrderToDb(items, total){
    PurchaseOrder.create({'items' : items, 'total' : total}).then(function(res){
    })

}


/**
 * This function gets the purchased product ready in a format that the stock service will recognise
 * @param {The ean of the product being purchased} ean 
 * @param {The number purchased of the product} number 
 */
function readyItemForStockUpdate(ean, number){
    return new Promise(function(resolve, reject){
        if(isNaN(number) || number <= 0){
            reject('incorrect incoming');
        }
    Product.findOne({Ean : ean}).then(function(item){
        var productDTO = new ProductDTO(item, number);
        resolve(productDTO.jsonVersion);
    }).catch(function(err){
        reject('no such item found');
    })
});
}


function updateStockWithPurchase(ean, number){
    console.log('I am making a post in here')
    try{
        readyItemForStockUpdate(ean, number).then(function(item){
            console.log('item being sent ' , item);
            console.log(config.stockServiceUpdaterURL);
            console.log('I am now making a post');
            request({
                url : config.stockServiceUpdaterURL,
                method:"POST",
                body: item,
                json: true
            }, function(error, res, body){
                console.log('I am in hereeeeee');
                if(error){
                    console.log('error with stock service url'. error);
                }
                console.log('i am the error ', error);
                console.log('sent as' , res);
                console.log('the body ', body);
       
            }).on('error', function(err) {
                console.log(err)
              })
    })}catch(err){
        console.log('error with stock service URL');
    }
}


module.exports = {completePurchase};
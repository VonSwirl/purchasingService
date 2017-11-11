var Product = require('../models/product.js');
var config = require('../config');
var request = require('request');

/**
 * Updates the product in the product database with the stock purchased that fulfils an outstanding order
 * @param {The ean number of the product} ean 
 * @param {The number purchased} number 
 */
function updateStockRequiredAfterOrderPlaced(ean, number){
    return new Promise(function(resolve, reject){
    Product.findOne({Ean : ean}).then(function(product, err){
        if(err){
            reject(err);
        }
         var numberOfStock = product.stockNeededForOrders.length;
         var readyToResolve = (numberOfStock === 0) ? true : false;
         if(readyToResolve){
             resolve(true);
         }
         for(var t = 0; t < numberOfStock && product.totalStockNeededForOrders > 0; t++){
                 if (t == numberOfStock-1){
                     readyToResolve = true;
                 }
                  var num = product.stockNeededForOrders[0]["number"];
                  var order = product.stockNeededForOrders[0]["orderNo"];
                  if(number >= num){
                    product.stockNeededForOrders.splice(0,1);
                    product.totalStockNeededForOrders = product.totalStockNeededForOrders - num;
                    letOrderServiceKnowProductHasBeenBrought(order, ean);
                    number -= num;
                 }else{
                    product.totalStockNeededForOrders = product.totalStockNeededForOrders - number;
                    product.stockNeededForOrders[0]["number"] = (product.stockNeededForOrders[0]["number"] - number);
                    readyToResolve = true;
                 };
                 product.save().then(function(){
                    if(readyToResolve){
                        resolve(true);
                    }
                 });
                 
         };

})});

}

/**
 * This method updates the product database adding to the stockNeededForOrders field the order that 
 * needs more of the item to send out the order and increase the 'totalStockNeededForOrders' value which
 * is displayed to the staff members when deciding which stock to purchase
 * @param {the order which has stock outstanding} order 
 * @param {the item that is missing from an order's ean number} item 
 * @param {the quantity of the item that is needed to fulfil the order} number 
 */
function addStockRequiredToProduct(order, itemEan, number){
    return new Promise(function(resolve, reject){
    Product.findOne({"Ean" : itemEan}).then(function (product){

    if(!product){
        reject('no product found');
      }else{
     var itemjson = {"number" : number, "orderNo" : order };
     var newItem = true;
     var numberOfCurrentOrdersOutstanding = product.stockNeededForOrders.length;
     if(numberOfCurrentOrdersOutstanding == 0){
        product.stockNeededForOrders.push(itemjson);
        product.totalStockNeededForOrders = number;
        product.save().then(function(){
            resolve(true);
        });
     }
     for(var i = 0 ; i < numberOfCurrentOrdersOutstanding; i++){
         if(product.stockNeededForOrders[i]["orderNo"] == order){
             product.stockNeededForOrders[i]["number"] = product.stockNeededForOrders[i]["number"] + number;
         }
         else{
            product.stockNeededForOrders.push(itemjson);
         }
      if(product.totalStockNeededForOrders){
          product.totalStockNeededForOrders = product.totalStockNeededForOrders + number;
      }
      else{
          product.totalStockNeededForOrders = number;
      }
      product.save().then(function(){
          resolve(true);
      });
      };
  }})})};


function letOrderServiceKnowProductHasBeenBrought(orderid, ean){
    //here we are posting to the order service with the details to make the order 
    try{
    request.post({
        url : config.orderServiceURLtoUpdateWithPurchase + orderid,
        body: {'ean' : ean},
        json: true
    });
}catch(err){
    console.log('error with letting order service know we have update');
}
}



module.exports = {updateStockRequiredAfterOrderPlaced, addStockRequiredToProduct};

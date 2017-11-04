var Product = require('../models/product.js');


/**
 * Updates the product in the product database with the stock purchased that furfils an outstanding order
 * @param {The ean number of the product} ean 
 * @param {The number purchased} number 
 */
function updateStockRequiredAfterOrderPlaced(ean, number){
    Product.findOne({Ean : ean}).then(function(product){
         var numberOfStock = product.stockNeededForOrders.length;
         for(var t = 0; t < numberOfStock && product.totalStockNeededForOrders > 0; t++){
                  var num = product.stockNeededForOrders[0]["number"];
                  var order = product.stockNeededForOrders[0]["orderNo"];
                  if(number >= num){
                    product.stockNeededForOrders.splice(0,1);
                    product.totalStockNeededForOrders = product.totalStockNeededForOrders - num;
                    letOrderServiceKnowProductHasBeenBrought(order, ean);
                    number -= num;
                 }else{
                    product.totalStockNeededForOrders = product.totalStockNeededForOrders - number;
                     product.stockNeededForOrders[0]["number"] = num - number;
                 };
                 product.save();
         };
})}

/**
 * This method updates the product database adding to the stockNeededForOrders field the order that 
 * needs more of the item to send out the order and increase the 'totalStockNeededForOrders' value which
 * is displayed to the staff members when deciding which stock to purchase
 * @param {the order which has stock outstanding} order 
 * @param {the item that is missing from an order's ean number} item 
 * @param {the quantity of the item that is needed to fulfil the order} number 
 */
function addStockRequiredToProduct(order, itemEan, number){
    Product.findOne({"Ean" : itemEan}).then(function (product){
    if(!product){
        console.log('productnotfoundfatalerror');
      }else{
     var itemjson = {"number" : number, "orderNo" : order };
     var alreadyCaptured = false;
     for(var i = 0 ; i < product.stockNeededForOrders.length; i++){
         if(product.stockNeededForOrders[i]["orderNo"] == order){
             alreadyCaptured = true;
         }
     };
      if(!alreadyCaptured){
          product.stockNeededForOrders.push(itemjson);
      if(product.totalStockNeededForOrders){
          product.totalStockNeededForOrders = product.totalStockNeededForOrders + number;
      }
      else{
          product.totalStockNeededForOrders = number;
      }
      product.save();
      };
  }
})};

function letOrderServiceKnowProductHasBeenBrought(orderid, ean){
    console.log(orderid, ean);
}



module.exports = {updateStockRequiredAfterOrderPlaced, addStockRequiredToProduct};

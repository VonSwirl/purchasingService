var config = {}

config.databaseURL = 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service';
config.orderServiceURLtoUpdateWithPurchase = "https://localhost:3004/order/PurchasingUpdate"; //"http://localhost:3004/PurchasingUpdate";
config.testDatabaseURL = "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service";
config.AdminServicePurchaseURL = "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
config.stockServiceUpdaterURL= "https://localhost:3003/api/newproduct";
<<<<<<< HEAD
config.secret = 'jwtsecret'
=======
congig.secret = 'jwtsecret'
>>>>>>> a42a3551371004f902e01cf2971c9bffbdb0bba8
module.exports = config;
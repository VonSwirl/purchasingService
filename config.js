var config = {}

config.databaseURL = 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service';
config.testDatabaseURL = "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service";

//Pre Deployment
//config.AdminServicePurchaseURL = "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
//config.stockServiceUpdaterURL= "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
//config.orderServiceURLtoUpdateWithPurchase = "https://localhost:3004/order/PurchasingUpdate"; //"http://localhost:3004/PurchasingUpdate";

//Deployment set up
config.orderServiceURLtoUpdateWithPurchase = "http://3amigoso.azurewebsites.net/order/PurchasingUpdate"; 
config.AdminServicePurchaseURL = "http://3amigosa.azurewebsites.net/purchasing/test";
config.stockServiceUpdaterURL= "http://3amigoss.azurewebsites.net/purchasing/test";

config.secret = 'jwtsecret'
module.exports = config;


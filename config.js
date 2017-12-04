var config = {}

config.databaseURL = 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service';
<<<<<<< HEAD
config.orderServiceURLtoUpdateWithPurchase = "http://3amigoso.azurewebsites.net/order/PurchasingUpdate/"; //"http://localhost:3004/PurchasingUpdate";
config.testDatabaseURL = "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service";
config.AdminServicePurchaseURL = "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
config.stockServiceUpdaterURL= "http://3amigoss.azurewebsites.net/api/newproducts";
=======
config.testDatabaseURL = "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service";

//Pre Deployment
//config.AdminServicePurchaseURL = "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
//config.stockServiceUpdaterURL= "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
//config.orderServiceURLtoUpdateWithPurchase = "https://localhost:3004/order/PurchasingUpdate"; //"http://localhost:3004/PurchasingUpdate";

//Deployment set up
config.orderServiceURLtoUpdateWithPurchase = "http://3amigoso.azurewebsites.net/order/PurchasingUpdate"; 
config.AdminServicePurchaseURL = "http://3amigosa.azurewebsites.net/purchasing/test";
config.stockServiceUpdaterURL= "http://3amigoss.azurewebsites.net/purchasing/test";

>>>>>>> 3f23dc7e70f0bdb59f31178b672efd11068576f1
config.secret = 'jwtsecret'
module.exports = config;


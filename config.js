var config = {}

config.databaseURL = 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service';
config.orderServiceURLtoUpdateWithPurchase = "https://peaceful-caverns-91545.herokuapp.com/purchasing/test"; //"http://localhost:3004/PurchasingUpdate";
config.testDatabaseURL = "mongodb://localhost:27017/MyDb";
config.AdminServicePurchaseURL = "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
config.stockServiceUpdaterURL= "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
module.exports = config;
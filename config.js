<<<<<<< HEAD
var standardTokenHandler = require('./utility/tokenHandler.js')

var development = {
    'tokenChecker' : standardTokenHandler,
    'databaseURL': 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service',
    'orderServiceURLtoUpdateWithPurchase': "http://3amigoso.azurewebsites.net/order/PurchasingUpdate/", //"http://localhost:3004/PurchasingUpdate";
    'AdminServicePurchaseURL': "https://peaceful-caverns-91545.herokuapp.com/purchasing/test",
    'stockServiceUpdaterURL': "http://3amigoss.azurewebsites.net/api/newproducts",
    'secret': 'jwtsecret'
}


var test = {
    'tokenChecker' : {'checkIfAuthorisedToPurchase' : function(res){return true} , 'pullToken' : true},
    'databaseURL': "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service",
    'orderServiceURLtoUpdateWithPurchase': "http://3amigoso.azurewebsites.net/order/PurchasingUpdate/", //"http://localhost:3004/PurchasingUpdate";
    'AdminServicePurchaseURL': "https://peaceful-caverns-91545.herokuapp.com/purchasing/test",
    'stockServiceUpdaterURL': "http://3amigoss.azurewebsites.net/api/newproducts",
    'secret': 'jwtsecret'
}

var standard = {
    'tokenChecker' : {'checkIfAuthorisedToPurchase' : function(res){return true} , 'pullToken' : true},
    'databaseURL': 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service',
    'orderServiceURLtoUpdateWithPurchase': "http://3amigoso.azurewebsites.net/order/PurchasingUpdate/", //"http://localhost:3004/PurchasingUpdate";
    'AdminServicePurchaseURL': "https://peaceful-caverns-91545.herokuapp.com/purchasing/test",
    'stockServiceUpdaterURL': "http://3amigoss.azurewebsites.net/api/newproducts",
    'secret': 'jwtsecret'
}


var config = function () {
    switch (process.env.NODE_ENV) {
        case 'development':
            return development;
        case 'standard':
            return standard;
        default:
            return development;
    }
}


module.exports = config();
=======
var config = {}

config.databaseURL = 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service';
config.orderServiceURLtoUpdateWithPurchase = "http://3amigoso.azurewebsites.net/order/PurchasingUpdate/"; //"http://localhost:3004/PurchasingUpdate";
config.testDatabaseURL = "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service";
config.AdminServicePurchaseURL = "https://peaceful-caverns-91545.herokuapp.com/purchasing/test";
config.stockServiceUpdaterURL= "http://3amigoss.azurewebsites.net/api/newproducts";

config.secret = 'jwtsecret'
module.exports = config;
>>>>>>> a05c315d662e22af43a21c77b4cb64e3f932bc4c


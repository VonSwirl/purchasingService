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
    console.log('in this bit' , process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
        case 'development':
            return development;
        case 'standard':
            return standard;
        default:
            return standard;
    }
}


module.exports = config();



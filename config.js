

var development = {
    'databaseURL': 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service',
    'orderServiceURLtoUpdateWithPurchase': "http://3amigoso.azurewebsites.net/order/PurchasingUpdate/", //"http://localhost:3004/PurchasingUpdate";
    'testDatabaseURL': "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service",
    'AdminServicePurchaseURL': "https://peaceful-caverns-91545.herokuapp.com/purchasing/test",
    'stockServiceUpdaterURL': "http://3amigoss.azurewebsites.net/api/newproducts",
    'secret': 'jwtsecret'
}

var test = {
    'databaseURL': 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service',
    'orderServiceURLtoUpdateWithPurchase': "http://3amigoso.azurewebsites.net/order/PurchasingUpdate/", //"http://localhost:3004/PurchasingUpdate";
    'testDatabaseURL': "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service",
    'AdminServicePurchaseURL': "https://peaceful-caverns-91545.herokuapp.com/purchasing/test",
    'stockServiceUpdaterURL': "http://3amigoss.azurewebsites.net/api/newproducts",
    'secret': 'jwtsecret'
}

var standard = {
    'databaseURL': 'mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service',
    'orderServiceURLtoUpdateWithPurchase': "http://3amigoso.azurewebsites.net/order/PurchasingUpdate/", //"http://localhost:3004/PurchasingUpdate";
    'testDatabaseURL': "mongodb://pserv:pserv1@ds121726.mlab.com:21726/test-purchase-service",
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


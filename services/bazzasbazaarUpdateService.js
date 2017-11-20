var soap = require('strong-soap').soap;
var config = require('../config');
var link = "http://bazzasbazaar.azurewebsites.net/Store.svc?wsdl";

function connectAndPullProducts(){
    return new Promise(function(resolve, reject){
    soap.createClient(link, function(err, client){
        var method = client['Store']["BasicHttpBinding_IStore"]["GetFilteredProducts"];
        method(function(err,res,env,soaphead){
            resolve(res.GetFilteredProductsResult.Product);
        })
    })
   
});}
module.exports = {connectAndPullProducts};
var express = require('express');
var app = express();
var bodyparse = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service');
//mongoose.connect('mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-servce');

app.get('/', function(req,res){
    res.send('hello')
});



app.listen(3000);
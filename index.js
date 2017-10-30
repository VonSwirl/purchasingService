var express = require('express');
var app = express();
var bodyparse = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service');

app.use('/purchasing', require('./routes/purchase'));
app.listen(8000);
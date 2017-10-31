var express = require('express');
var app = express();
var bodyparse = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://pserv:pserv1@ds241055.mlab.com:41055/purchase-service');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyparse.json());
app.use(bodyparse.urlencoded({extended: true}));


app.set('views', './views');
app.set('view engine', 'pug');


app.use('/purchasing', require('./routes/purchase'));

app.use(function(err, req, res, next){
    res.status(422).send({err: err.message});
})
app.listen(process.env.port || 3000);
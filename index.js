var express = require('express');
var app = express();
var bodyparse = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var schedule = require('node-schedule');
var stockUpdate = require('./services/supplierStockUpdater.js');

var connectWithRetry = function() {
    return mongoose.connect(config.databaseURL, function(err) {
      if (err) {
        console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
        setTimeout(connectWithRetry, 5000);
      }
    });
  };


connectWithRetry();
mongoose.Promise = global.Promise;


process.env.UV_THREADPOOL_SIZE = 128;

app.use(bodyparse.json());
app.use(bodyparse.urlencoded({extended: true}));

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');


app.use('/purchasing', require('./routes/purchase'));



/**
 * Gets a list of all the product avaliable for purchase with the suppliers that have them in stock
 */
app.get('/',function(req, res,next){
    res.redirect('/purchasing');
});



var rule = new schedule.RecurrenceRule();
rule.hour = 16;
rule.minute = 40;

var j = schedule.scheduleJob(rule, function(){
    stockUpdate.updateDbWithAllSupplierStockDetails();
})


app.use(function(err, req, res, next){
    res.status(422).send({err: err.message});
})
app.listen(process.env.PORT || 3001);
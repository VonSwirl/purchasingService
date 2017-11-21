var express = require('express');
var app = express();
var bodyparse = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var schedule = require('node-schedule');
var stockUpdate = require('./services/supplierStockUpdater.js');

mongoose.connect(config.databaseURL);
mongoose.Promise = global.Promise;

app.use(bodyparse.json());
app.use(bodyparse.urlencoded({extended: true}));

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');


app.use('/purchasing', require('./routes/purchase'));



/**
 * Gets a list of all the product avaliable for purchase with the suppliers that have them in stock
 */
router.get('/',function(req, res,next){
    res.send('I am a test');
});



var rule = new schedule.RecurrenceRule();
rule.hour = 16;
rule.minute = 40;

var j = schedule.scheduleJob(rule, function(){
    console.log('in here');
    stockUpdate.updateDbWithAllSupplierStockDetails();
})


app.use(function(err, req, res, next){
    res.status(422).send({err: err.message});
})
app.listen(process.env.port || 3001);
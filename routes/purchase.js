var express = require('express');
var router = express.Router();
const Supplier = require('../models/suppliers.js');

//I should list all the suppliers
router.get('/', function(req, res, next){

  Supplier.find({}).then(function(doc){
      res.send(doc);
  })
});

//I should list all the products from a supplier
router.get('/:id', function(req,res,next){
})

router.post('/autopurchase', function(req,res,next){
    res.send('you are purchasing stock');
})

module.exports = router;
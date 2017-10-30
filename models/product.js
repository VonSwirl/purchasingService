const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductSupplySchema = require('./productsupply.js');

const ProductSchema = new Schema({
    Ean: String,
    name: String,
    description: String,
    suppliersThatStock: [ProductSupplySchema]
});

const Product = mongoose.model('product', ProductSchema);



module.exports = 
    Product;

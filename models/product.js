const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductSupplySchema = require('./productsupply.js');

const ProductSchema = new Schema({
    Ean: String,
    name: String,
    description: String,
    brandName: String,
    categoryName: String,
    suppliersThatStock: [{type: mongoose.Schema.Types.ObjectId, ref: 'productsupply'}],
    stockNeededForOrders : [{orderNo : String, number : Number}],
    totalStockNeededForOrders : {type : Number, default : 0}
});

const Product = mongoose.model('product', ProductSchema);



module.exports = 
    Product;

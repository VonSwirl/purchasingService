const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProductSupplySchema = new Schema({
    supplierName: String,
    price: Number,
    Ean: String,
    inStock: Boolean

});

const ProductSupply = mongoose.model('productsupply', ProductSupplySchema);

module.exports =  ProductSupply;

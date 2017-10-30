const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProductSupplySchema = new Schema({
    supplierName: String,
    price: Number,
    Ean: String,
    inStock: Boolean

});


module.exports =  mongoose.model('productsupply', ProductSupplySchema);
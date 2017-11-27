const mongoose =  require('mongoose')
const Schema = mongoose.Schema;


const PurchaseOrderSchema = new Schema({
    items : [{Ean : String, Number : Number}],
    total : Number,
    date : {type : Date, default : Date.now }
})


const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);


module.exports = PurchaseOrder;
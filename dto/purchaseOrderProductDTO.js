
/**
 * A DTO to be passed to the admin service to make an order
 */
class purchaseOrderProductDTO{

    constructor (supplierName, ean, noRequired, price){
            this._items = [];
            this._supplierName = supplierName;
            this._items.push({'ean' : ean, 'number' : noRequired});
            this._total = parseInt(noRequired) * parseFloat(price);
            console.log(this._total, 'i am the total');
    }


    addItems(ean, number, price) {
         this._items.push({'ean' : ean, 'number' : number});
         this._total += parseInt(number) * parseFloat(price);
    }

    get jsonVersionForPayment(){
        return {'supplierName' : this._supplierName,
        'total' : this._total,
}}


    get suppliername(){
        return this._supplierName;
    }

    }


module.exports = purchaseOrderProductDTO;

/**
 * A DTO to be passed to the admin service to make an order
 */
class purchaseOrderDTO{

    constructor (supplierName, ean, noRequired, cost){
            this._items = [];
            this._supplierName = supplierName;
            this._items.push({'ean' : ean, 'number' : noRequired});
            this._total = cost;
    }


    addItems(ean, number, cost) {
         this._items.push({'ean' : ean, 'number' : number});
         this._total += cost;
    }

    get jsonVersionForPayment(){
        return {'supplierName' : this._supplierName,
        'total' : this._total,
}}


    get suppliername(){
        return this._supplierName;
    }

    }


module.exports = purchaseOrderDTO;
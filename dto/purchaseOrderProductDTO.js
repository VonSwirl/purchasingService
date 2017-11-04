/**
 * A DTO to be passed to the admin service to make an order
 */
class purchaseOrderProductDTO{

    constructor (name, noRequired, ean, supplierName){
            this._name = name;
            this._numberRequired = noRequired;
            this._ean = ean;
            this._supplierName = supplierName;
    }

    get jsonVersion(){
        return {'name' : this._name,
        'numberRequired' : this._numberRequired,
        'ean' : this._ean,
        'suppliername' : this._suppliername
}}

    get ean(){
        return this._ean;
    }

    get numberRequired(){
        return parseInt(this._numberRequired);
    }
    }


module.exports = purchaseOrderProductDTO;
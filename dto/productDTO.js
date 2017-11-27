/**
 * A DTO to be passed to the admin service to make an order
 */
class ProductDTO{
    
        constructor (item, numberNeeded){
                this._name = item.name;
                this._numberRequired = numberNeeded ;
                this._ean = item.Ean;
                this._category = item.category;
                this._brand = item.brandName;
                this._description = item.description;
        }
    
        get jsonVersion(){
            return {'name' : this._name,
            'numberRequired' : this._numberRequired,
            'ean' : this._ean,
            'category' : this._category,
            'brand' : this._brand,
            'description' :this._description
    }}
    
    
        }
    
    
    module.exports = ProductDTO;
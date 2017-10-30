const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSupplySchema = new Schema({
    supplierName: String,
    price: Number,
    Ean: String,
    inStock: Boolean

})

const ProductSchema = new Schema({
    Ean: String,
    name: String,
    description: String,
    suppliersThatStock: [ProductSupplySchema]
});

const Product = mongoose.model('product', ProductSchema);
const ProductSupply = mongoose.model('productsupply', ProductSupplySchema);

function checkAndRetrieveProduct(ean) {
    Product.findOne({
        Ean: ean
    }).then(function (product) {
        return product;
    });
}

function addNewProductToDatabase(item) {
    Product.create({
        Ean: item.Ean,
        name: item.Name,
        description: item.Description,
        suppliersThatStock: [ProductSupply.create({
            supplierName: supplier,
            price: item.Price,
            Ean: item.Ean,
            inStock: item.InStock
        })]
    })
}

function addANewProductSupply(currentProductSupplyList) {
    currentProductSupplyList.push(ProductSupply.create({
        supplierName: supplier,
        price: infoOnProductInSupplierBank.Price,
        Ean: currentProduct.Ean,
        inStock: infoOnProductInSupplierBank.InStock
    }))
    return currentProductSupplyList;


}
function findCurrentSupplierDetailsOfProduct(currentProduct, infoOnProductInSupplierBank, supplier) {
    ProductSupply.find({
        supplierName: supplier,
        Ean: item.Ean
    }).then(function (supplierlink) {
        if (supplierlink == null) {

            var newProductSupplyList = addANewProductSupply(currentProduct.suppliersThatStock);

            Product.findOneAndUpdate({ Ean: currentProduct.ean },
                { suppliersThatStock: newProductSupplyList }, function (err, product) {
                    if (err) {
                        console.log('i am an error');
                    }
                })

        }

    }
            }



function updateProductsDatabase(datain, supplier) {

    var data = JSON.parse(datain);
    for (var i = 0; i < Object.keys(data).length; i++) {
        var infoOnProductInSupplierBank = data[i];
        console.log(data[i].Ean);
        var currentProduct = checkAndRetrieveProduct(data[i].Ean);
        if (currentProduct == null) {
            addNewProductToDatabase(infoOnProductInSupplierBank);
        }
        else {
            findCurrentSupplierDetailsOfProduct(currentProduct, infoOnProductInSupplierBank, supplier);
        }

    }

}


module.exports = {
    updateProductsDatabase,
    Product
}
    ;

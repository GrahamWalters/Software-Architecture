// models/product.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var warehouse    = mongoose.createConnection('mongodb://localhost/warehouse');
var random       = require('mongoose-simple-random');

var ProductSchema = new Schema({
    name : String,
    desc : String,
    brand : String,
    price : Number,
    quantity : Number,
    promo : String
});

ProductSchema.plugin(random);

module.exports = warehouse.model('Product', ProductSchema);

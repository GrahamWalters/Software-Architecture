// models/product.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProductSchema = new Schema({
    name : String,
    desc : String,
    brand : String,
    price : Number,
    quantity : Number,
    promo : String
});

module.exports = mongoose.model('Product', ProductSchema);

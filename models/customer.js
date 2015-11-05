// models/customer.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var accounting   = mongoose.createConnection('mongodb://localhost/accounting');
var random       = require('mongoose-simple-random');

var CustomerSchema = new Schema({
    firstName  : String,
    lastName   : String,
    loyaltyNum : Number
});

CustomerSchema.plugin(random);

module.exports = accounting.model('Customer', CustomerSchema);

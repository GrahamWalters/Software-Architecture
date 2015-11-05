// models/purchase.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var accounting   = mongoose.createConnection('mongodb://localhost/accounting');
var random       = require('mongoose-simple-random');

var PurchaseSchema = new Schema({
    customer : { type: Schema.Types.ObjectId, ref: 'Customer' },
    date : { type: Date, default: Date.now },
    total : Number,
    products : [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    branch : String
});

PurchaseSchema.plugin(random);

module.exports = accounting.model('Purchase', PurchaseSchema);

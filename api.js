/*jslint node: true */
'use strict';

var config          = require('./config')
var express         = require('express');
var api             = express.Router();
var _               = require('underscore');
var moment          = require('moment');
var sendgrid        = require('sendgrid')(config.SENDGRID_API);

var Product         = require('./models/product');
var Customer        = require('./models/customer');
var Purchase        = require('./models/purchase');

api.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


api.route('/products/')

    // get all the products (accessed at GET /api/products)
    .get(function(req, res) {
        Product.find({}, function(err, products) {
            if (err) throw err;

            var productsMap = {};
            products.forEach(function(product) {
                productsMap[product._id] = product;
            })

            res.json(productsMap);
        })
    })

    // create a product (accessed at POST /api/products)
    .post(function(req, res) {
        var product = new Product(req.body);
        product.save(function(err, product) {
            if (err) throw err;
            res.json({'status':'created', 'product': product});
        })
    });


api.route('/products/:id')

    // get the product with this id (accessed at GET /api/products/:id)
    .get(function(req, res) {
        Product.findById(req.params.id, function(err, product) {
            if (err) throw err;
            res.json(product);
        })
    })

    // update the product with this id (accessed at PUT /api/products/:id)
    .put(function(req, res) {
        Product.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, product) {
            if (err) throw err;
            res.json({'status':'updated', 'product': product});
        });
    })

    // delete the product with this id (accessed at DELETE /api/products/:id)
    .delete(function(req, res) {
        Product.findByIdAndRemove(req.params.id, function(err) {
            if (err) throw err;
            console.log('Removed', req.params.id);

            res.json({'status':'removed'});
        });
    });


api.route('/stock/')
    .get(function(req, res) {
        Product.find({ quantity:0 }, function(err, products) {
            if (err) throw err;

            var payload   = {
                to      : config.email.to,
                from    : config.email.from,
                subject : 'Out Of Stock',
                html    : 'The following items are out of stock<br><br><ul>'
            };

            products.forEach(function(product) {
                payload.html += '<li><a href="http://localhost:3001/#/product/'+product._id+'/">'+product.desc+'</a></li>';
            });

            payload.html += '</ul>';

            sendgrid.send(payload, function(err, json) {
                if (err) { console.error(err); }
                console.log(json);
            });

            res.json(products);
        });
    });


api.route('/customers/')
    .get(function(req, res) {
        Customer.find({}, function(err, customers) {
            if (err) throw err;

            res.json(customers);
        });
    });



api.route('/year-report/')
    .get(function(req, res) {
        var start = moment().startOf('year').toDate();
        var end = moment().startOf('month').toDate();

        Purchase.aggregate({
            $match: {
                date : { $lt: end, $gt: start }
            }
        },{
            $group: {
                _id:   { month: {$month: '$date' }, year: {$year: '$date' }},
                total: { $sum: '$total' },
                items: { $sum: { $size: '$products' }}
            }
        }).sort({'_id.month': 1}).exec(function(err, report) {
            if (err) throw err;

            report = _.map(report, function(d) {
                return {
                    Month: d._id.month,
                    Total: d.total,
                    Items: d.items
                };
            });

            res.json(report);
        });
    });


api.route('/30-day-report/')
    .get(function(req, res) {
        var start = new Date();
        var end = moment().startOf('month').toDate();
        var end = moment().subtract(30, 'day').toDate();

        Purchase.aggregate({
            $match: {
                date : { $lt: start, $gt: end }
            }
        },{
            $group: {
                _id:   { day: {$dayOfMonth: '$date'}, month: {$month: '$date' }, year: {$year: '$date' }},
                total: { $sum: '$total' },
                items: { $sum: { $size: '$products' }}
            }
        }).sort({'_id.month': 1, '_id.day': 1}).exec(function(err, report) {
            if (err) throw err;

            var report = _.map(report, function(d) {
                return {
                    Date: d._id.year+'/'+d._id.month+'/'+d._id.day,
                    Total: d.total,
                    Items: d.items
                };
            });

            res.json(report);
        });
    });


module.exports = api;

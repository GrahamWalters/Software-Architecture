/*jslint node: true */
'use strict';

var express        = require('express');
var app            = express();
var server         = app.listen(3001);
var compress       = require('compression');
var bodyParser     = require('body-parser');
// var _              = require('underscore');

var mongoose       = require('mongoose');
// var Schema         = mongoose.Schema;
mongoose.connect('mongodb://localhost/warehouse');


app.use( compress() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( express.static('public') );


// ROUTES FOR THE API
// =============================================================================
var api = require('./api');
app.use('/api', api);

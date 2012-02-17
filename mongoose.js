var mongoose = require('mongoose')
	, options = { auto_reconnect: true, native_parser: true }
	, connection = mongoose.createConnection('mongodb://admin:Pass09Word@staff.mongohq.com:10048/BoleroDB', options)

module.exports = connection;

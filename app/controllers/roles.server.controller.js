'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Role = mongoose.model('Role'),
	_ = require('lodash');

exports.create = function(req, res) {
	var role = new Role(req.body);

	role.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(role);
		}
	});
};

exports.read = function(req, res) {
	res.jsonp(req.role);
};

exports.update = function(req, res) {
	var role = req.role ;

	role = _.extend(role , req.body);

	role.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(role);
		}
	});
};

exports.list = function(req, res) {
	Role.find().sort('-name').exec(function(err, roles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roles);
		}
	});
};

exports.roleByID = function(req, res, next, id) {
	Role.findById(id).exec(function(err, role) {
		if (err) return next(err);
		if (! role) return next(new Error('Failed to load Role ' + id));
		req.role = role ;
		next();
	});
};

exports.hasAuthorization = function(req, res, next) {
	//TODO
	next();
};
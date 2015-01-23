'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	MemberRole = mongoose.model('MemberRole'),
	_ = require('lodash');

/**
 * Create a Member role
 */
exports.create = function(req, res) {
	var memberRole = new MemberRole(req.body);

	memberRole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(memberRole);
		}
	});
};

/**
 * Show the current Member role
 */
exports.read = function(req, res) {
	res.jsonp(req.memberRole);
};

/**
 * Update a Member role
 */
exports.update = function(req, res) {
	var memberRole = req.memberRole ;

	memberRole = _.extend(memberRole , req.body);

	memberRole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(memberRole);
		}
	});
};

/**
 * Delete an Member role
 */
exports.delete = function(req, res) {
	var memberRole = req.memberRole ;

	memberRole.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(memberRole);
		}
	});
};

/**
 * List of Member roles
 */
exports.list = function(req, res) {
	MemberRole.find().populate('role', 'name').populate('member', 'project').exec(function(err, memberRoles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(memberRoles);
		}
	});
};

/**
 * Member role middleware
 */
exports.memberRoleByID = function(req, res, next, id) {
	MemberRole.findById(id).populate('role', 'name').populate('member', 'project').exec(function(err, memberRole) {
		if (err) return next(err);
		if (! memberRole) return next(new Error('Failed to load Member role ' + id));
		req.memberRole = memberRole ;
		next();
	});
};

/**
 * Member role authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	//TODO add authorization
	next();
};

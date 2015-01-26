'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ProjectUser = mongoose.model('ProjectUser'),
	_ = require('lodash');

/**
 * Create a Project user
 */
exports.create = function(req, res) {
	var projectUser = new ProjectUser(req.body);
	projectUser.user = req.user;

	projectUser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectUser);
		}
	});
};

/**
 * Show the current Project user
 */
exports.read = function(req, res) {
	res.jsonp(req.projectUser);
};

/**
 * Update a Project user
 */
exports.update = function(req, res) {
	var projectUser = req.projectUser ;

	projectUser = _.extend(projectUser , req.body);

	projectUser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectUser);
		}
	});
};

/**
 * Delete an Project user
 */
exports.delete = function(req, res) {
	var projectUser = req.projectUser ;

	projectUser.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectUser);
		}
	});
};

/**
 * List of Project users
 */
exports.list = function(req, res) {
	ProjectUser.find().populate('user', 'displayName').exec(function(err, projectUsers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectUsers);
		}
	});
};

/**
 * Project user middleware
 */
exports.projectUserByID = function(req, res, next, id) {
	ProjectUser.findById(id).populate('user', 'displayName').exec(function(err, projectUser) {
		if (err) return next(err);
		if (! projectUser) return next(new Error('Failed to load Project user ' + id));
		req.projectUser = projectUser ;
		next();
	});
};

/**
 * Project user authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.projectUser.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

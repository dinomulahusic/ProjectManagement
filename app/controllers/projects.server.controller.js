'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),
	_ = require('lodash');

exports.create = function(req, res) {
	var project = new Project(req.body);
	project.user_created = req.user;

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(project);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.project);
};

exports.update = function(req, res) {
	var project = req.project;
	project = _.extend(project, req.body);

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(project);
		}
	});
};

exports.delete = function(req, res) {
	var project = req.project;
	project = _.extend(project, req.body);
	project.status = 'deleted';
	
	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(project);
		}
	});
};

exports.list = function(req, res) {
	Project.find().sort('-create_date').populate('user_created', 'displayName').exec(function(err, projects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(projects);
		}
	});
};

exports.projectByID = function(req, res, next, id) {
	Project.findById(id).populate('user_created', 'displayName').exec(function(err, project) {
		if (err) return next(err);
		if (!project) return next(new Error('Failed to load project ' + id));
		req.project = project;
		next();
	});
};

exports.hasAuthorization = function(req, res, next) {
	if (req.project.user_created.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

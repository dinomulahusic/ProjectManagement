'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Member = mongoose.model('Member'),
	_ = require('lodash');

exports.create = function(req, res) {
  var member = new Member(req.body);
	member.user = req.user;
	member.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);			
		}
	});
};

exports.read = function(req, res) {
	res.jsonp(req.member);
};

exports.update = function(req, res) {
	var member = req.member;

	member = _.extend(member, req.body);

	member.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
		}
	});
};

exports.delete = function(req, res) {
	var member = req.member;

	member.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
		}
	});
};

exports.list = function(req, res) {
	Member.find().populate('user', 'displayName').populate('project', 'title').exec(function(err, members) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(members);
		}
	});
};

exports.memberByID = function(req, res, next, id) {
	Member.findById(id).populate('user', 'displayName').populate('project', 'title').exec(function(err, member) {
		if (err) return next(err);
		if (! member) return next(new Error('Failed to load Member ' + id));
		req.member = member;
		next();
	});
};

exports.hasAuthorization = function(req, res, next) {
	//TODO
	next();
};

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project user Schema
 */
var ProjectUserSchema = new Schema({
	Project: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ProjectUser', ProjectUserSchema);

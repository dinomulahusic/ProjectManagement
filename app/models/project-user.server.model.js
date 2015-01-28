'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProjectUserSchema = new Schema({
	project: {
		type: Schema.ObjectId,
		ref: 'Project',
    required: 'Project is required'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ProjectUser', ProjectUserSchema);

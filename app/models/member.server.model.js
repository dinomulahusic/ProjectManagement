'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MemberSchema = new Schema({
	project: {
		type: Schema.ObjectId,
		ref: 'Project',
    	required: 'Project is required'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'User is required'
	}
});

mongoose.model('Member', MemberSchema);

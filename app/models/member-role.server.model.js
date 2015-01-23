'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MemberRoleSchema = new Schema({
	member: {
		type: Schema.ObjectId,
		ref: 'Member',
    required: 'Please provide Member'
	},
	role: {
		type: Schema.ObjectId,
		ref: 'Role',
    required: 'Please provide Role'
	}
});

mongoose.model('MemberRole', MemberRoleSchema);

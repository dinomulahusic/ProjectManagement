'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MemberRoleSchema = new Schema({
	member: {
		type: Schema.ObjectId,
		ref: 'Member',
    	required: 'Member is required'
	},
	role: {
		type: Schema.ObjectId,
		ref: 'Role',
    	required: 'Role is required'
	}
});

mongoose.model('MemberRole', MemberRoleSchema);

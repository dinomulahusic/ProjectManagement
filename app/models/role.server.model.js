'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RoleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Role name',
		trim: true,
    	unique: true
	}
});

mongoose.model('Role', RoleSchema);

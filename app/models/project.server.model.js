'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
  status: {
    type: String,
    default: '',
    trim: true
  },
  create_date: {
		type: Date,
		default: Date.now
	},
  update_date: {
    type: Date,
    default: Date.now
  },
	user_created: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Project', ProjectSchema);

const mongoose = require('mongoose');
const CONSTANTS = require('../constants');

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  todoText: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function(todoText) {
        return todoText.length > 1;
      },
      msg: `todo must be at least 2 characters`
    }
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function(status) {
        return [CONSTANTS.STATUS.ACTIVE, CONSTANTS.STATUS.COMPLETED].includes(status);
      },
      msg: `status must be one of [${CONSTANTS.STATUS.ACTIVE}, ${
        CONSTANTS.STATUS.COMPLETED
      }]`
    }
  },
  owner: {
    type: String,
    trim: true,
    required: true
  }
});

module.exports = mongoose.model('Todo', TodoSchema);

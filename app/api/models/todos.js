const mongoose = require('mongoose');
const CONSTANTS = require('../constants');

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
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
        return [CONSTANTS.STATUS.ACTIVE, CONSTANTS.STATUS.COMPLETED].includes(
          status
        );
      },
      msg: `one of [${CONSTANTS.STATUS.ACTIVE}, ${CONSTANTS.STATUS.COMPLETED}]`
    }
  },
  owner: {
    type: String,
    trim: true,
    required: true
  }
});

module.exports = mongoose.model('Todo', TodoSchema);

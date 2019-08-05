const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function(name) {
        return name > 1;
      },
      msg: `name must be at least 2 characters`
    }
  },
  email: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm;
        return re.test(email);
      },
      msg: `wrong format`
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function(pass) {
        return pass > 7;
      },
      msg: `name must be at least 8 characters`
    }
  }
});

UserSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

module.exports = mongoose.model('User', UserSchema);

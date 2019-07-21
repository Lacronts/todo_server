const mongoose = require('mongoose');
const mongoDB = process.env.DB_HOST;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;

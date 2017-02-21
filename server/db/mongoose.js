const mongoose = require('mongoose');

// config mongoose to use promise instead of callback
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoAppApi');

module.exports = { mongoose };
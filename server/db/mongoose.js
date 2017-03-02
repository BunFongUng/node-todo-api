const mongoose = require('mongoose');

// config mongoose to use promise instead of callback
mongoose.Promise = global.Promise;

if (process.env.NODE_ENV === 'production') {
    var mongodbUI = 'mongodb://todo_user:123456@ds163679.mlab.com:63679/todoapi';
} else {
    var mongodbUI = 'mongodb://localhost:27017/TodoAppApi';
}
mongoose.connect(mongodbUI);

module.exports = { mongoose };
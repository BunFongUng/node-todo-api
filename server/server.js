let mongoose = require('mongoose');

// config mongoose to use promise instead of callback
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoAppApi');

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    completedAt: {
        type: Number,
        required: true
    }
});

let newTodo = new Todo({
    text: "Learn ReactJs",
    completed: false,
    completedAt: 12313123
});

newTodo.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log(JSON.stringify(err, undefined, 2));
});
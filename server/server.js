const express = require('express');

const { ObjectID } = require('mongodb');

const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');

const { User } = require('./models/user');

const { Todo } = require('./models/todo');

const port = process.env.PORT || 3333;

let app = express();

app.use(bodyParser.json());


// create new todo 
app.post('/todos', (req, res) => {
    console.log('==== create todos =====');
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err.errors.text.message);
    });
});

// get all todo
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            status: 'success',
            data: todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

//find todo by id
app.get('/todo/:id', (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({
            status: 'error',
            message: 'Invalid todo id.'
        })
    }

    Todo.findById(req.params.id)
        .then((todo) => {
            if (!todo) {
                return console.log('Todo not found.');
            }
            res.send({
                'status': 'success',
                todo
            });
        }, (err) => {
            console.log('Unable to find todo by id.', err);
        });
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };
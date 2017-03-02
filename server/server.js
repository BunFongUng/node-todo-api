const express = require('express');

const _ = require('lodash');

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
app.get('/todos/:id', (req, res) => {

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
        }).catch((e) => {
            res.status(404).send();
        });
})

app.delete('/todos/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({
            status: 'error',
            message: 'Invalid todo id'
        });
    }

    Todo.findByIdAndRemove(req.params.id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send({
                    'status': 'error',
                    'message': 'Todo id not found.'
                });
            }

            res.send({
                'status': 'success',
                todo
            });
        }, (err) => {
            res.status(400).send({
                'status': 'error',
                'message': 'Unable to delete todo by id.'
            });
        }).catch((err) => {
            res.status(404).send();
        });
});

// update to todo by id

app.patch('/todos/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            status: 'error',
            message: 'Invalid todo id'
        });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                status: 'error',
                message: 'Todo not found'
            });
        }
        res.send({
            status: 'success',
            message: 'Successfully updated todo',
            todo
        });

    }).catch((e) => {
        res.status(400).send({
            status: 'error',
            message: 'Unable to update todo by id'
        });
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };
require('./config/config');

const express = require('express');

const _ = require('lodash');

const { ObjectID } = require('mongodb');

const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');

const { User } = require('./models/user');

const { Todo } = require('./models/todo');

const { authenticate } = require('./middleware/authenticate');

const port = process.env.PORT;

let app = express();

app.use(bodyParser.json());


// create new todo 
app.post('/todos', authenticate, (req, res) => {
    console.log('==== create todos =====');
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err.errors.text.message);
    });
});

// get all todo
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            status: 'success',
            data: todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

//find todo by id
app.get('/todos/:id', authenticate, (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({
            status: 'error',
            message: 'Invalid todo id.'
        })
    }

    Todo.findOne({
            _id: req.params.id,
            _creator: req.user._id
        })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({
                'status': 'success',
                todo
            });
        }, (err) => {
            res.status(400).send();
            // console.log('Unable to find todo by id.', err);
        }).catch((e) => {
            res.status(404).send();
        });
})

app.delete('/todos/:id', authenticate, (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({
            status: 'error',
            message: 'Invalid todo id'
        });
    }

    Todo.findOneAndRemove({
            _id: req.params.id,
            _creator: req.user._id
        })
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

app.patch('/todos/:id', authenticate, (req, res) => {

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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
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

// create users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({
            status: 'success',
            data: user
        })
    }).catch((err) => {
        res.status(400).send({
            status: 'error',
            message: err
        });
    });
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send({
            status: 'error',
            error: err
        });
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (err) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };
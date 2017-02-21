const express = require('express');

const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');

const { User } = require('./models/user');

const { Todo } = require('./models/todo');

const port = process.env.PORT || 3333;

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log('==== create todos =====');
    let todo = new Todo({});

    todo.save().then((doc) => {
        res.status(200).send(doc);
    }, (err) => {
        res.status(400).send(err.errors.text.message);
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
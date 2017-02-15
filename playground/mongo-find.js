const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoAppApi', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server!', err);
    }

    console.log('Connected to MongoDB server.');

    db.collection('Todos').find({ _id: new ObjectID('58a1b3b07f97df2b749bfc8c') }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fecth todos', err);
    });

    db.collection('Users').find().toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fecth users', err);
    });

    db.collection('Users').find().count().then((count) => {
        console.log(`Users count: ${count}`);
    }, (err) => {
        console.log('Unable to count users', err);
    });
});
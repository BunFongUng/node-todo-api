// const MongoClient = require('mongodb').MongoClient;
const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoAppApi', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }

    console.log('successfully connected to mongodb server');

    db.collection('Todos').insertOne({
        title: "Learn Laravel",
        completed: true
    }, (err, result) => {
        if (err) {
            console.log('could not insert data into collection');
        } else {
            console.log(`you have insert one document of ${result} into collection`);
        }
    });

    // db.collection('Users').insertOne({
    //     name: "Lester",
    //     age: 25,
    //     location: "8BT, Phnom Penh"
    // }, (err, result) => {
    //     if (err) {
    //         console.log('Unable to insert document into collection', err);
    //     } else {
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     }
    // });
    db.close();
});
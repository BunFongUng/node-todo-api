const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoAppApi', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.');
    }

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('58a1b3b07f97df2b749bfc8c')
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to update document', err);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('58a455e928cc9720a6680596')
    }, {
        $set: {
            name: 'Lester Ly'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    }, (err) => {
        console.log('Unable to updaate document', err);
    });

});
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoAppApi', (err, db) => {
    if (err) {
        console.log('Unable to connect to MongoDB server.', err);
    } else {
        console.log('Connected to MongoDB server.');

        // deleteMany
        // db.collection('Users').deleteMany({ name: 'Lester' }).then((result) => {
        //     console.log(result);
        // }, (err) => {
        //     console.log('Unable to delete document', err);
        // });

        //deleteOne
        // db.collection('Todos').deleteOne({ title: "watch porn" }).then((result) => {
        //     console.log(result);
        // }, (err) => {
        //     console.log('Unable to delete document', err);
        // });

        //findOneAndDelete 
        db.collection('Todos').findOneAndDelete({ _id: new ObjectID('58a4577528cc9720a66805d9') }).then((result) => {
            console.log(result);
        }, (err) => {
            console.log('Unable to delete document', err);
        });

        db.close();
    }
});
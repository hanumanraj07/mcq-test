const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hanumanraj07:12345@cluster0.ngznyap.mongodb.net/Mcq?appName=Cluster0')
    .then(async () => {
        const db = mongoose.connection.db;
        const doc = await db.collection('cpp').findOne({});
        console.log(JSON.stringify(doc, null, 2));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });


const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
require('dotenv').config();

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.odwvb.mongodb.net/volunteer-network?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventsCollections = client.db("volunteer-network").collection("taskCategory");
    const volunteerCollection = client.db("volunteer-network").collection("newVolunteer");
    //add volunteer in database 
    app.post('/addVolunteer', (req, res) => {
        const newVolunteer = req.body;
        volunteerCollection.insertOne(newVolunteer)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    //get specific events
    app.get('/getEvent/:id', (req, res) => {
        const taskId = parseInt(req.params.id)
        eventsCollections.find({ id: taskId })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    // get all volunteer
    app.get('/getVolunteerData', (req, res) => {
        eventsCollections.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    // find specific volunteer with email 
    app.get('/getUserTasks', (req, res) => {
        volunteerCollection.find({ userEmail: req.query.userEmail })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.delete('/CancelEvents/:id', (req, res) => {
        const userId = ObjectID(req.params.id);

        volunteerCollection.deleteOne({ _id: userId })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

});




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)
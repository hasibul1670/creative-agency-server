const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const cors = require('cors');
const { ObjectID } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const password = "hasib110";
require('dotenv').config()

console.log()
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('service'));
app.use(fileUpload());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hasib:hasib110@cluster0.lcyjp.mongodb.net/creative?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db("creative").collection("data");
    const book = client.db("creative").collection("feedback");
    const form = client.db("creative").collection("servicedata");



    app.post('/addevent', (req, res) => {
        const newbooking = req.body;
        form.insertOne(newbooking)
        console.log(newbooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    app.post('/service', (req, res) => {
        const newbooking = req.body;
        book.insertOne(newbooking)
        console.log(newbooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });
    app.post('/addservice', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const text= req.body.text;
        const newImg = file.data;
        console.log(req.body.title,req.body.text);
      console.log(file);

        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        book.insertOne({ title,text, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })  
    })

    app.post('/ser', (req, res) => {
        const newbooking = req.body;
        bookings.insertOne(newbooking)
        console.log(newbooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });
        //////////////data read from server////////////

        app.get('/addevent/', (req, res) => {
            form.find({})
                .toArray((err, documents) => {
                    res.send(documents);
                })
        })
        app.get('/admin/', (req, res) => {
            form.find({})
                .toArray((err, documents) => {
                    res.send(documents);
                })
        })
        app.get('/event/', (req, res) => {
           form.find({ email: req.query.email })
                .toArray((err, documents) => {
                    res.send(documents);
                })
        })
    app.get('/ser', (req, res) => {
            bookings.find({})
                .toArray((err, documents) => {
                    res.send(documents);
                })
        })

        app.get('/service', (req, res) => {
            book.find({})
                .toArray((err, documents) => {
                    res.send(documents);
                })
        })
      
    app.get('/', (req, res) => {
        res.send("hello i am in work")
    });
});




app.listen(process.env.PORT || port);
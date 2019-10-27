const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
//const url = 'mongodb+srv://andrews-admin:togos95050@cluster0-zuvim.mongodb.net/test?replicaSet=rs0&retryWrites=true&w=majority';

// Database Name
//const dbName = 'myproject';
const dbName = 'sampledb';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  
    debugger;
    db.collection('slates').countDocuments(function(err, count ){
//    db.counts.count(function(err, count ){
        console.log('{ pageCount: ' + count + '}');
//  res.send('{ pageCount: ' + count + '}');
    });

  
  //client.close();
});
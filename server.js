//  OpenShift sample Node application
const assert = require('assert');
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    url     = require('url');

var generateKey = require('./generateKey');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
app.use(express.json());
// able to access main.js with:, but not GETing properly
app.use('/react/slate/', express.static('views/react'));
//blocks main.js from loading if declared early:
app.use('/react/slate/:key?', express.static('views/react'));
//works with /123/0
app.use('/react/slate/:key?/:senderkey?', express.static('views/react'));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];

  // If using env vars from secret from service binding  
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;
  const MongoClient = require('mongodb').MongoClient;

  const dbName = 'sampledb';

  //mongodb.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, conn) { //, { useUnifiedTopology: true }
  //MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }); //, { useUnifiedTopology: true }
  // only works with MongoDB Atlas:
  //const client = new MongoClient(mongoURL, { useUnifiedTopology: true }); //, { useUnifiedTopology: true }
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
  
      if (err) {
        callback(err);
        return;
      }
  
      //db = conn;
      console.log('db.databaseName:'+db.databaseName);
      dbDetails.databaseName = db.databaseName;
      dbDetails.url = mongoURLLabel;
      dbDetails.type = 'MongoDB';
  
      console.log('Connected to MongoDB at: %s', mongoURL);

      db.collection('slates').countDocuments(function(err, count ){
//      db.counts.count(function(err, count ){
          console.log('{ pageCount: ' + count + ' }');
//    res.send('{ pageCount: ' + count + ' }');
      });
     
      debugger;
      //client.close();
  });
  //});
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/react', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    res.render('react/index.html', {  });
  } else {
    res.render('react/index.html', {  });
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    //db.collection('counts').count(function(err, count ){
    db.counts.count(function(err, count ){
      console.log('count');
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

function mail(to, from, subject, text, html) {
  'use strict';
  const nodemailer = require('nodemailer');

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
//          host: 'in-v3.mailjet.com',
          host: 'smtp-relay.sendinblue.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
//          Mailjet
//              user: 'dc455a1cc7b71b0231476013ce7aadee',
//              pass: '01251cd7d61036c4d1ef4bfd64ea3343',
              user: 'andrew95051@outlook.com',
              pass: 'YO8Q9CgTmIrMGawx'
          }
      });

      // send mail with defined transport object // 👻
      let info = await transporter.sendMail({
//          from: '"Andrew Sh" <andrew95051@outlook.com>', // sender address
//          to: 'ashaw85@hotmail.com', // list of receivers, ashaw85@hotmail.com rejects Mailjet
//          subject: 'Hello ✔', // Subject line
//          text: 'Hello world?', // plain text body
//          html: '<b>Hello world?</b>' // html body
          from: from, // sender address
          to: to, // list of receivers, ashaw85@hotmail.com rejects Mailjet
          subject: subject, // Subject line
          text: text, // plain text body
          html: html // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      // res.send('{"status":"processed"}');
  }

  main().catch(console.error);
}

app.get('/email-95050', function (req, res) {
  mail('ashaw85@hotmail.com', 'andrew95050@outlook.com', '2019-10-24 14:50 test', 'Hello');
});

app.get('/email-slate/:fromEmail', function(req, res) {
  // Plan to have user request, not directly to putxx, generate and email key with user email
  // Plan is to have keys as [recipientEmail][senderEmail][uniqueCode]/[senderKey]
  // How about including email and tracking attempts?
  if (!/(.*)@(.+)\.(.+)/.test(req.params.fromEmail)) {
    res.send({"status": "malformed email"});
    return;
  }
  let slates = db.collection('slates');
  let cursor = slates.find({"fromEmail": req.params.fromEmail});
  async function checkEmailDuplication() {
    emailArray = await cursor.toArray();
    if(emailArray.length === 0) {
      let key = req.params.fromEmail + '-' + generateKey(15);
      let senderKey = generateKey(3);
      slates.insert({
        ip: req.ip, 
        date: Date.now(), 
        fromEmail: req.params.fromEmail,
        toEmail: 'ashaw85@hotmail.com',
        key: key, 
        message: 'Hi.', 
        senderKey: senderKey
      });
      mail(req.params.fromEmail, 'andrew95051@outlook.com', 'Your Slate', 
          `To see your slate, copy and paste http://${req.headers.host}/react/slate/${key}/${senderKey} into your browser's address field. The issuer will be emailed a recipient version that tracks read status.`,
          `To see your slate, click or copy and paste <a href="http://${req.headers.host}/react/slate/${key}/${senderKey}">http://${req.headers.host}/react/slate/${key}/${senderKey}</a> into your browser's address field. The issuer will be emailed a recipient version that tracks read status.`
          );

      mail('ashaw85@hotmail.com', 'andrew95051@outlook.com', 'Your Slate', 
          `You have received a slate from ${req.params.fromEmail}. To see your slate, copy and paste http://${req.headers.host}/react/slate/${key} into your browser's address field.`,
          `You have received a slate from <a href="mailto:${req.params.fromEmail}">${req.params.fromEmail}</a>. To see your slate, click or copy and paste <a href="http://${req.headers.host}/react/slate/${key}">http://${req.headers.host}/react/slate/${key}</a> into your browser's address field.`
          );
      
      res.send({"status": "processed"});
    }
    else {
      res.send({"status": "duplicate, so not added"});
    }
  }
  checkEmailDuplication();
});

app.post('/slate/post/:key/:senderKey?', function(req, res) {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    let slates = db.collection('slates');
    let message;
    if (req.params.key === '123' && req.body.message.length>3) {
      message=req.body.message.substring(0,3);
    }
    else {
      message=req.body.message;
    }
    if (typeof req.params.key === 'number' || typeof req.params.key === 'string') {
      slates.updateOne({key: req.params.key},
          {$set: {message: message,
            updateTime: Date.now()}}
      );
      cursor = slates.find({key: req.params.key});
      cursor.toArray().then((data)=>{
        if (data != undefined &&
            data.length > 0 && data[0].hasOwnProperty('fromEmail') && 
            data[0].hasOwnProperty('senderKey') && data[0].senderKey.toString() === req.params.senderKey.toString()) {
          mail(data[0].toEmail, data[0].fromEmail, data[0].fromEmail + ' has updated the Slate', 
              `To see your slate, copy and paste http://${req.headers.host}/react/slate/${req.params.key} into your browser's address field.`,
              `To see your slate, click or copy and paste <a href="http://${req.headers.host}/react/slate/${req.params.key}">http://${req.headers.host}/react/slate/${req.params.key}</a> into your browser's address field.`
              );
          
        }
      });
      res.send('{"status": "processed"}');
    }
    else {
      console.log('Key was not a string, so barred.');
      res.send('{"status": "not processed"}');
    }
  }
});

app.get('/slate/get/:key/:senderKey?', async function(req, res) {
  if (!db) {
    initDb(function(err){
      console.log(err);
    });
  }
  if (db) {
    let slates = db.collection('slates'),
        criteria, 
        cursor;
    async function checkKeyExists(key) {
      let sampleCursor = slates.find({key: key}),
          dataArray = await sampleCursor.toArray();
      if (dataArray.length)
        return true;
      return false
    }
    
    let demoKeys = ['123', '124'],
        myStarterKey = 'andrew95050',
        checkForTheseKeys = [
          ...demoKeys, 
          'andrew95050'
        ],
        starterSlateCommonProperties = {
            ip: req.ip, 
            date: Date.now(), 
            message: 'Hi.'
        };
     
      checkForTheseKeys.forEach((item)=>{
        checkKeyExists(item).then((exists)=>{
          if(!exists) {
            let edits = myStarterKey === item ? 
                {
                  toEmail: 'ashaw85@hotmail.com',
                  fromEmail: 'andrew95051ads@outlook.com',
                  senderKey: 'outsideCentral'
                } :
                {
                  toEmail: 'andrew95051ads@outlook.com', 
                  fromEmail: 'ashaw85@yahoo.com',
                  senderKey: '321'
                };
            edits.key = item;
            slates.insert(Object.assign(starterSlateCommonProperties, edits))
          }
        },
        (err)=>{
          console.log(err);
        });
      }); // end checkedForMinimumKeys
    if (typeof req.params.key === "string") {
      criteria = {
          "key": decodeURIComponent(req.params.key)
      }
      cursor = slates.find(criteria);
      cursor.toArray().then((data)=>{
        let updateViewedTime = () => {
          slates.updateOne(criteria,
              {$set: {viewedTime: Date.now()}}
              );
          mail(data[0].fromEmail, data[0].toEmail, data[0].toEmail + ' has accessed your Slate.', 
              `The message was ${data[0].message}  To see your slate, copy and paste http://${req.headers.host}/react/slate/${data[0].xskey} into your browser's address field.`,
              `The message was ${data[0].message}  To see your slate, click or copy and paste <a href="http://${req.headers.host}/react/slate/${data[0].key}">http://${req.headers.host}/react/slate/${data[0].key}</a> into your browser's address field.`
              );
        }
        if (data != undefined &&
            data.length > 0 && data[0].hasOwnProperty('senderKey')) {
              if (req.params.senderKey !== undefined && req.params.senderKey == data[0].senderKey) {
                // do not updateViewedTime();
              }
              else {
                updateViewedTime();
              }
              delete data[0].senderKey;
              delete data[0].toEmail;
              delete data[0].fromEmail;
              res.send(JSON.stringify(data));
        }
        else {
          updateViewedTime();
        }
      },
      (err)=>{
        console.log('err:'+err);
      });
    }
    else {
      console.log('Key was not a string, so barred.');
    }
  } // if (db) 
});

app.get('/slate/:key/:senderKey?', function(req, res) {
  console.log('key:'+req.params.key);
  console.log('senderKey:'+req.params.senderKey);
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    res.render('slate.html', {  });
  }
});

app.put('/slate/put95113/:key/:senderKey?', function(req, res) {
//Plan to have user request, not directly to putxx, generate and email key with user email
  // Plan is to have keys as [recipientEmail][senderEmail][uniqueCode]/[senderKey]
  // How about including email and tracking attempts?
  let slates = db.collection('slates');
  slates.insert({
    ip: req.ip, 
    date: Date.now(), 
    key: req.params.key, 
    message: 'Hi.', 
    senderKey: req.params.senderKey
  });
  res.send({"status": "processed"});
})

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;

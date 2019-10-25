//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    url     = require('url');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
app.use(express.json());
// able to access main.js with:, but not GETing properly
app.use('/react/slate/', express.static('views/react'));
//blocks main.js from loading if declared early:
app.use('/react/slate/:key?', express.static('views/react'));
//app.use('/react/slate/:key(\d+)', express.static('views/react')); // /user/:userId(\d+)
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

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
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
      console.log('');
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
  
  let slates = db.collection('slates');
  let cursor = slates.find({"fromEmail": req.params.fromEmail});
  async function checkEmailDuplication() {
    emailArray = await cursor.toArray();
    if(emailArray.length === 0) {
      let key = req.params.fromEmail + '-' + parseInt(Math.random() * 1000);
      let senderKey = parseInt(Math.random() * 1000);
      slates.insert({
        ip: req.ip, 
        date: Date.now(), 
        fromEmail: req.params.fromEmail,
        key: key, 
        message: 'Hi.', 
        senderKey: senderKey
      });
      mail(req.params.fromEmail, 'andrew95051@outlook.com', 'Your Slate', 
          `To see your slate, copy and paste ${req.rawHeaders[1]}/react/slate/${key}/${senderKey} into your browser's address field`,
          `To see your slate, click or copy and paste <a href="${req.rawHeaders[1]}/react/slate/${key}/${senderKey}">${req.rawHeaders[1]}/react/slate/${key}/${senderKey}</a> into your browser's address field`
          );  // /react/slate/123/95050/

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
      slates.update({key: req.params.key},
          {$set: {message: message,
            updateTime: Date.now()}}
      );
      res.send('{"status": "processed"}');
    }
    else {
      res.send('{"status": "not processed"}');
    }
  }
});

app.get('/slate/get/:key/:senderKey?', function(req, res) {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    console.log('at API, key:'+req.params.key);
    console.log('senderKey:'+req.params.senderKey);
    let slates = db.collection('slates');
    let criteria, cursor;
    let checkSampleExists = new Promise((resolve, reject) => {
      let sampleCursor = slates.find({key: "123"});
      sampleCursor.toArray().then((dataArray)=> {
        if (dataArray.length > 0) {
          resolve(dataArray);
        }
        else {
          reject(dataArray);
        }
      },
      (err)=>reject('err:'+err));
    });

    // Only needed to set up initial sample.
    checkSampleExists.then((dataArray)=>{
    },
    (err)=>{
      console.log('err:'+JSON.stringify(err));
      slates.insert({ip: req.ip, date: Date.now(), key: '123', toEmail: 'ashaw85@hotmail.com', 
        fromEmail: 'andrew95051ads@outlook.com', message: 'Hi.', senderKey: '95050'});
    });

    let checkStarterSlateExists = new Promise((resolve, reject) => {
      let sampleCursor = slates.find({key: "andrew95050"});
      sampleCursor.toArray().then((dataArray)=> {
        if (dataArray.length > 0) {
          resolve(dataArray);
        }
        else {
          reject(dataArray);
        }
      },
      (err)=>reject('err:'+err));
    });

    // Only needed to set up initial sample.
    checkStarterSlateExists.then((dataArray)=>{
    },
    (err)=>{
      console.log('err:'+JSON.stringify(err));
      slates.insert({ip: req.ip, date: Date.now(), key: 'andrew95050', toEmail: 'ashaw85@hotmail.com', 
        fromEmail: 'andrew95051ads@outlook.com', message: 'Hi.', senderKey: 'outsideCentral'});
    });

    if (typeof req.params.key === "string") {
      //slates.insert({ip: req.ip, date: Date.now(), key: req.params.key});
    }
    else {
      console.log('Key was object');
    }
    keyCriteria = decodeURIComponent(req.params.key);
    criteria = {
        "key": keyCriteria
    }
    if (typeof keyCriteria == 'string') {
      cursor = slates.find(criteria);
      cursor.toArray().then((data)=>{
        let updateViewedTime = () => {
          slates.update(criteria,
              {$set: {viewedTime: Date.now()}}
              );
        }
        debugger;
        if (data != undefined &&
            data.length > 0 && data[0].hasOwnProperty('senderKey')) {
              if (req.params.senderKey !== undefined && req.params.senderKey != data[0].senderKey) {
                updateViewedTime();
              }
              delete data[0].senderKey;
        }
        else {
          updateViewedTime();
        }

        res.send(JSON.stringify(data));
      },
      ()=>{});
    }
//    else {
//      console.log('criteria was object');
//      res.render('slate.html', {  });
//    }
  } // if (db) 
  else {
    res.render('slate.html', {  });
  }
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

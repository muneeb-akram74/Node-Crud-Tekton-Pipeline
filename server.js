//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

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

app.get('/email-box', function (req, res) {
  'use strict';
  const nodemailer = require('nodemailer');

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: 'andrew-openshift@outlook.com',
              pass: 'Centr@l95051'
          }
      });
//      var transporter = nodemailer.createTransport("SMTP",{
//        service: "Gmail",
//        auth: {
//            user: "andrew2004@gmail.com",
//            pass: "userpass"
//        }
//      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
          from: '"Andrew S 👻" <andrew-openshift@outlook.com>', // sender address
          to: 'ashaw85@hotmail.com', // list of receivers
          subject: 'Hello ✔', // Subject line
          text: 'Hello world?', // plain text body
          html: '<b>Hello world?</b>' // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  main().catch(console.error);
  
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    
  } else {
    
  }
});

app.get('/slate/:key', function(req, res) {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    let slates = db.collection('slates');
    let criteria, cursor;
    //var slates = db.slates;
    //if ()
    // Create a document with request IP and current time of request
    if (typeof req.params.key === "string") {
      //slates.insert({ip: req.ip, date: Date.now(), key: req.params.key});
    }
    else {
      console.log('Key was object');
    }
    //res.render('slate.html', {  });
    //slates.find()
    //keyCriteria = JSON.parse(req.params.key);
    keyCriteria = decodeURIComponent(req.params.key);
    //keyCriteria = {"$gt":""};
    //keyCriteria = "5";
    //keyCriteria = JSON.stringify(keyCriteria);
    console.log('keyCriteria:' + keyCriteria);
    criteria = {
//        "key": "5" //works
        "key": keyCriteria //works
        //"key": {"$gt":""}
    }
    console.log('criteria:'+JSON.stringify(criteria));
    if (typeof keyCriteria == 'string') {
      cursor = slates.find(criteria);
      //res.send('find:'+JSON.stringify(slates.find(criteria)));
      cursor.toArray().then((data)=>{
        console.log('data:'+data);
        res.send(JSON.stringify(data));
      },
          ()=>{});
      //res.send('find:'+JSON.stringify());
    }
    else {
      console.log('criteria was object');
      res.render('slate.html', {  });
    }
  } else {
    //res.render('slate.html', {  });
  }
});

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

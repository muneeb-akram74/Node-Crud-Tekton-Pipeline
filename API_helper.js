/*
 * Credit to and reference https://codehandbook.org/how-to-make-rest-api-calls-in-express-web-app/
 */

const request = require('request');
const http = require('http');
const https = require('https');

module.exports = {
  /*
   ** This method returns a promise
   ** which gets resolved or rejected based
   ** on the result from the API
   */
  make_API_call: function(uri, postData, method) {
    // https://stackoverflow.com/questions/32327858/how-to-send-a-post-request-from-node-js-express
    console.log('postData:'+JSON.stringify(postData));
    if (typeof method === 'undefined') {
      method = 'POST';
    }
    var clientServerOptions = {
      uri,
      body: JSON.stringify(postData),
      method,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return new Promise((resolve, reject) => {
      request(clientServerOptions, (err, res, body) => {
        if (err) reject(err)
        resolve(body)
      })
    })
  },
  make_http_call: function(host, path, port, postData, method) {
    // https://stackoverflow.com/questions/32327858/how-to-send-a-post-request-from-node-js-express
    let outsideServerResponse;
    if (typeof method === 'undefined') {
      method = 'POST';
    }
    if (typeof port === 'undefined') {
      port = 80;
    }
    let hostname = host;
    const options = {
      hostname,
      path,
      port: 443,
      method,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length,
      }
    }

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.on('data', (d) => {
          process.stdout.write(d);
          resolve(d);
        })
      })
      req.on('error', (error) => {
        console.error(error);
        reject(error);
      })
      req.write(postData);
      req.end();
    });
  }
}
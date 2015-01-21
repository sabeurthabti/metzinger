var RemoteFiles = require('../lib/RemoteFiles.js');
var LocalFiles = require('../lib/LocalFiles.js');
var co = require('co');

var uid = 'test-a1';

var localFiles = new LocalFiles(uid, 'artifacts');
var remoteFiles = new RemoteFiles(uid, 'masthead-develop');

// var pull = remoteFiles.pull('ref', localFiles.pathFor('ref'));

// pull.then(function(n) {
//   console.log(n);
// })

// co(remoteFiles.pull('ref', localFiles.pathFor('ref'))).then(function() {
//   console.log("Done");
// });

co(remoteFiles.push('ref', localFiles.pathFor('ref'))).then(function() {
  console.log("Done");
}, function(err) {
  console.log(err);
});

// remoteFiles.push(localFiles.pathFor('ref'), 'ref');
var RemoteFiles = require('../lib/RemoteFiles.js');
var LocalFiles = require('../lib/LocalFiles.js');

var uid = 'test-a1';

var localFiles = new LocalFiles(uid, 'artifacts');
var remoteFiles = new RemoteFiles(uid, 'masthead-develop');

// remoteFiles.pull('ref', localFiles.pathFor('ref'));
remoteFiles.push(localFiles.pathFor('new'), 'new');
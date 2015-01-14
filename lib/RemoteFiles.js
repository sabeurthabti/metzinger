var Dropbox = require('dropbox'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp');

var RemoteFiles = function(uid, basePath) {
  this.basePath = basePath;
  this.remoteFolders = {
    'ref' : path.join('reference_screenshots'),
    'diff' : path.join(uid, 'different_screenshots'),
    'new' : path.join(uid, 'new_screenshots')
  };

  // REMOVE THIS BEFORE PUTTING INTO GIT
  this.client = new Dropbox.Client({token: process.env.DROPBOX_TOKEN});
}

RemoteFiles.prototype.pull = function(key, dest) {
  var src = path.join(this.basePath, this.remoteFolders[key]);
  if(!fs.existsSync(dest)) mkdirp.sync(dest);

  this.readDir(src).then(function(files) {
    return Q.all( files.map(function(file) {
      return this.fetchFile( path.join(this.basePath, this.remoteFolders[key], file) );
    }.bind(this)) );
  }.bind(this), function(err) {
    throw err;
  }).then(function(data) {
    return Q.all( data.map(function(file) {
      return this.saveFile( path.join(dest, file.name), file.data);
    }.bind(this)))
  }.bind(this), function(err) {
    throw err;
  }).done();
}

RemoteFiles.prototype.push = function(src, key) {
  // console.log("src: ", src);
  // console.log("key: ", key);
  // this.client.mkdir( path.join(this.basePath, this.remoteFolderes[key]) )
  // this.mkdir( path.join(this.basePath, this.remoteFolders[key]) ).then(function(stat) {
  //   console.log(stat);
  // })
  var fullPath = path.join(this.basePath, this.remoteFolders[key]);

  this.exists( fullPath ).then(function(stat) {
    var deferred = Q.defer();

  }, function(err) {
    return this.mkdir( this.fullPath );
  })
}

RemoteFiles.prototype.readDir = function(src) {
  var deferred = Q.defer();
  this.client.readdir(src, function(err, files) {
    if (err) deferred.reject(err);
    else deferred.resolve(files);
  });

  return deferred.promise;
}

RemoteFiles.prototype.fetchFile = function(src) {
  var deferred = Q.defer();
  this.client.readFile(src, {buffer: true}, function(err, file) {
    if (err) deferred.reject(err);
    else deferred.resolve({data: file, name: path.basename(src)});
  });

  return deferred.promise;
}

RemoteFiles.prototype.saveFile = function(dest, data) {
  var deferred = Q.defer();
  fs.writeFile(dest, data, function(err) {
    if (err) deferred.reject(err);
    else deferred.resolve();
  });

  return deferred.promise;
}

RemoteFiles.prototype.mkdir = function(dest) {
  var deferred = Q.defer();
  this.client.mkdir(dest, function(err, stat) {
    if (err) deferred.reject(err);
    else deferred.resolve(stat);
  });

  return deferred.promise;
}

RemoteFiles.prototype.exists = function(dest) {
  var deferred = Q.defer();
  var fullDest = path.join(this.basePath, dest);
  this.client.metadata(fullDest, function(err, stat) {
    if (err) deferred.reject(err);
    else deferred.resolve(stat);
  });

  return deferred.promise;
}

module.exports = RemoteFiles;
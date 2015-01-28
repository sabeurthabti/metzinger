var path = require('path'),
    fs = require('fs'),
    debug = require('debug')('localfiles'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp');

var LocalFiles = function (basePath) {
    debug('Initialised with: ' + basePath);
    this.basePath = basePath;
    this.folders = {
      'ref': path.join(basePath, 'reference_screenshots'),
      'diff': path.join(basePath, 'different_screenshots'),
      'new': path.join(basePath, 'new_screenshots'),
      'tmp': path.join(basePath, 'tmp_screenshots')
    };

    Object.keys(this.folders).forEach(function(key) {
      mkdirp.sync(this.folders[key]);
    }.bind(this));

    return this;
};

LocalFiles.prototype.setup = function() {
  debug('Setting up directories.');

  return Promise.all(Object.keys(this.folders).map(function(localPath) {
    return this.mkdirp(localPath);
  }.bind(this)));
};

LocalFiles.prototype.mkdirp = function(key) {
  var localPath = this.folders[key];
  debug('Creating directory: ' + localPath);

  return new Promise(function(resolve, reject) {
    mkdirp(localPath, function(err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

LocalFiles.prototype.rimraf = function(key) {
  var localPath = this.folders[key];
  debug('Deleting directory: ' + localPath);

  return new Promise(function(resolve, reject) {
    mkdirp(localPath, function(err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

LocalFiles.prototype.rename = function(fromPath, toPath) {
  debug('Renaming ' + fromPath + ' to ' + toPath);

  return new Promise(function(resolve, reject) {
    fs.rename(fromPath, toPath, function(err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

LocalFiles.prototype.exists = function(localPath) {
  debug('Checking existence of ' + localPath);
  return new Promise(function(resolve, reject) {
    fs.exists(localPath, function(exists) {
      resolve(exists);
    });
  });
};

LocalFiles.prototype.readFile = function(localPath) {
  debug('Reading file ' + localPath);
  return new Promise(function(resolve, reject) {
    fs.readFile(localPath, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

LocalFiles.prototype.writeFile = function(localPath, data) {
  debug('Writing file ' + localPath);
  return new Promise(function(resolve, reject) {
    fs.writeFile(localPath, data, function(err) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

LocalFiles.prototype.deleteFile = function(localPath) {
  debug('Deleting file ' + localPath);
  return new Promise(function(resolve, reject) {
    fs.unlink(localPath, function(err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

module.exports = LocalFiles;
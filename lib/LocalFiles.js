var path = require('path'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp');

var LocalFiles = function(uid, basePath) {
    this.folders = {
      'ref': path.join(basePath, 'reference_screenshots'),
      'diff': path.join(basePath, uid, 'different_screenshots'),
      'new': path.join(basePath, uid, 'new_screenshots'),
      'tmp': path.join(basePath, uid, 'tmp_screenshots')
    };

    Object.keys( this.folders ).forEach(function(key) {
      this._setupDirectoryFor(key);
    }.bind(this));
};

LocalFiles.prototype.pathFor = function(key) {
  return this.folders[key];
};

LocalFiles.prototype._setupDirectoryFor = function(key) {
  rimraf.sync( this.pathFor(key) );
  mkdirp.sync( this.pathFor(key) );
};

module.exports = LocalFiles;
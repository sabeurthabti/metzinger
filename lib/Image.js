// var fs = require('fs'),
//     gm = require('../../gm'),
//     Q = require('q');

// var Image = function(path, opts) {
//   this.path = path;

//   if ( fs.existsSync(path) ) {
//     this.gm = gm(path)
//   } else {
//     throw "File not found: " + path;
//   }

//   return this;
// }

// Image.prototype.crop = function(width, height) {
//   var deferred = Q.defer();
//   this.gm.crop(width, height, 0, 0);
//   this.gm.write(this.path, function(err) {
//     if (err) deferred.reject(err);
//     else deferred.resolve();
//   });
//   return deferred.promise;
// }

// Image.prototype.size = function() {
//   var deferred = Q.defer();
//   this.gm.size(function(err, size) {
//     if (err) deferred.reject(err);
//     else deferred.resolve(size);
//   });
//   return deferred.promise;
// }

// module.exports = Image;
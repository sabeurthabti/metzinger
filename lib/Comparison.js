// var fs = require('fs'),
//     gm = require('../../gm'),
//     Q = require('q');

// var Comparison = function() {
//   this.SIMILARITY_THRESHOLD = 42;
// };

// Comparison.prototype.spotDifferencesBetween = function(refScreenshot, screenshot) {
//   return Q.all([ refScreenshot.size(), screenshot.size() ]).then(function(sizes) {
//     var min = {
//       width: Math.min.apply( Math, sizes.map(function(size) { return size.width; })),
//       height: Math.min.apply( Math, sizes.map(function(size) { return size.height;}))
//     };

//     return Q.all([ refScreenshot.crop(min.width, min.height), screenshot.crop(min.width, min.height) ]);
//   }).then(function() {
//     return this.compare(refScreenshot, screenshot);
//   }.bind(this));
// }

// Comparison.prototype.compare = function(refScreenshot, screenshot) {
//   var deferred = Q.defer();
//   var options = {
//     metric: 'psnr'
//   };

//   gm.compare(refScreenshot.path, screenshot.path, options, function(err, isEqual, psnr, raw) {
//     if (err) {
//       deferred.reject(err);
//     } else {
//       //Undefined is returned when PSNR is infinite (i.e there is no difference)
//       console.log("PSNR: ", psnr)
//       deferred.resolve( (psnr === "inf") || (psnr >= this.SIMILARITY_THRESHOLD) );
//     }
//   });

//   return deferred.promise;
// }

// module.exports = new Comparison();
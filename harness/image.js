var Q = require('q');

var Image = require('../lib/Image.js');

var screenshot = new Image('./artifacts/reference_screenshots/bing_rich.png');
var refScreenshot = new Image('./artifacts/abc123/different_screenshots/bing_rich.png');

console.log("Image set.");

Q.all([ screenshot.size(), refScreenshot.size() ]).then(function(sizes) {
  console.log(sizes);
}, function(err) {
  console.log(err);
});


// image.size().then(function(size) {
//   return image.crop(100, 100, 0, 0);
// }, function(err) {
//   console.log("Error: ", err);
// }).then(function() {
//   console.log("Cropped!");
// }, function(err) {
//   console.log("Error: ", err);
// });

// console.log(image);
// var LocalFiles = require('../lib/LocalFiles');
// var rimraf = require('rimraf');
// var fs = require('fs');
// var path = require('path');
// var co = require('co');

// describe("LocalFiles library", function() {
//   var basePath = './tmp';
//   describe("initialisation", function() {
//     var localFiles = new LocalFiles(basePath);

//     it("should return LocalFiles object", function() {
//       expect(typeof(localFiles)).toEqual('object');
//     });

//     [ 'different_screenshots',
//       'new_screenshots',
//       'reference_screenshots',
//       'tmp_screenshots'].forEach(function(folder) {

//       it("should create a " + folder + " folder", function(done) {
//         fs.exists( path.join(basePath, folder), function(exists) {
//           expect(exists).toBe(true);
//           done();
//         });
//       });
//     });
//   });

//   afterAll(function() {
//     rimraf.sync(basePath);
//   });
// });
var path = require('path'),
    debug = require('debug')('metzinger'),
    LocalFiles = require('./lib/LocalFiles.js'),
    Resemble = require('./lib/Resemble.js');

var Metzinger = function (tag, driver) {
  this.driver = driver;
  this.tag = tag;
  this.localFiles = new LocalFiles(process.env.SCREENSHOT_PATH || './test/screenshots');

  return this;
}

Metzinger.prototype.checkVisualRegression = function*(pageName, opts) {
  var screenshot = yield this.takeScreenshot();
  yield this.localFiles.writeFile( this.pathFor('tmp', pageName), screenshot );

  var referenceExists = yield this.localFiles.exists( this.pathFor('ref', pageName) );

  if (!referenceExists) {
    var pathFrom = this.pathFor('tmp', pageName);
    var pathTo = this.pathFor('new', pageName);

    yield this.localFiles.rename(this.pathFor('tmp', pageName), this.pathFor('new', pageName));
    throw 'New screenshot for ' + pageName;
  }

  var reference = yield this.localFiles.readFile( this.pathFor('ref', pageName) );
  var sample = yield this.localFiles.readFile( this.pathFor('tmp', pageName) );

  var result = yield this.compare(reference, sample, pageName);
  if( result === true ) {
    yield this.localFiles.deleteFile(this.pathFor('tmp', pageName));
    return true;
  } else {
    yield this.localFiles.rename(this.pathFor('tmp', pageName), this.pathFor('diff', pageName));
    throw result;
  }
}

Metzinger.prototype.takeScreenshot = function(pageName, opts) {
  debug('Take screenshot of ' + pageName);
  var imagePath = this.pathFor('tmp', pageName);
  return new Promise(function(resolve, reject) {
    this.driver.takeScreenshot().then(function(data) {
      resolve(data);
    }.bind(this));
  }.bind(this));
}

Metzinger.prototype.compare = function(reference, sample, pageName) {
  debug('Starting comparison for ' + pageName);
  return new Promise(function(resolve, reject) {;
    Resemble(reference).compareTo(sample).onComplete(function(data) {
      debug('-> Comparison complete.')
      debug('-> Data: ' + JSON.stringify(data));
      if(parseFloat(data.misMatchPercentage) === 0.00) {
        debug('-> Screenshots match.')
        resolve(true);
      } else {
        debug('-> Screenshots do NOT mach.');
        reject( new Error("Screenshots for " + pageName + " do not match (" + data.misMatchPercentage + "% mismatch).") );
      }
    });
  });
}

Metzinger.prototype.fileNameFor = function(pageName) {
  return pageName + '_' + this.tag + '.png';
}

Metzinger.prototype.pathFor = function(key, pageName) {
  return path.join(this.localFiles.folders[key], this.fileNameFor(pageName));
}

module.exports = Metzinger;
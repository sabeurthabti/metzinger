var path = require('path'),
    debug = require('debug')('metzinger'),
    LocalFiles = require('./lib/LocalFiles.js'),
    Resemble = require('./lib/Resemble.js');

var Metzinger = function(tag, driver) {
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
    debug('New Screenshot for ' + pageName);
    var pathFrom = this.pathFor('tmp', pageName);
    var pathTo = this.pathFor('new', pageName);

    yield this.localFiles.rename(this.pathFor('tmp', pageName), this.pathFor('new', pageName));

    return {status: false, message: "Metzinger: new screenshot created for " + pageName}
  }

  var reference = yield this.localFiles.readFile( this.pathFor('ref', pageName) );
  var sample = yield this.localFiles.readFile( this.pathFor('tmp', pageName) );

  if( (yield this.compare(reference, sample, pageName)) === true) {
    yield this.localFiles.deleteFile(this.pathFor('tmp', pageName));
    return {status: true, message: "Metzinger: screenshots match."}
  } else {
    yield this.localFiles.rename(this.pathFor('tmp', pageName), this.pathFor('diff', pageName));
    return {status: false, message: "Metzinger: screenshots for " + pageName + " do NOT match."}
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
      parseFloat(data.misMatchPercentage) === 0.00 ? resolve(true) : resolve(false);
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
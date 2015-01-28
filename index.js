var path = require('path'),
    debug = require('debug')('metzinger'),
    co = require('co'),
    LocalFiles = require('./lib/LocalFiles.js'),
    Crop = require('./lib/Crop.js'),
    Resemble = require('./lib/Resemble.js');

var Metzinger = function(tag, driver) {
  this.driver = driver;
  this.tag = tag;
  this.localFiles = new LocalFiles(process.env.SCREENSHOT_PATH || './test/screenshots');

  return this;
}

Metzinger.prototype.checkVisualRegression = co.wrap(function*(pageName, element) {
  var screenshot = yield this.takeScreenshot();

  debug(screenshot);

  if (typeof(element) != "undefined") {
    screenshot = yield this.isolate(screenshot, element);
  }

  var referenceExists = yield this.localFiles.exists( this.pathFor('ref', pageName) );

  if (!referenceExists) {
    debug('New Screenshot for ' + pageName);
    var pathFrom = this.pathFor('tmp', pageName);
    var pathTo = this.pathFor('new', pageName);

    yield this.localFiles.writeFile(this.pathFor('new', pageName), screenshot);

    return {status: false, message: "Metzinger: new screenshot created for " + pageName}
  }

  var reference = yield this.localFiles.readFile( this.pathFor('ref', pageName) );

  if( (yield this.compare(reference, screenshot, pageName)) === true) {
    return {status: true, message: "Metzinger: screenshots match."}
  } else {
    yield this.localFiles.writeFile(this.pathFor('diff', pageName), screenshot);
    return {status: false, message: "Metzinger: screenshots for " + pageName + " do NOT match."}
  }
});

Metzinger.prototype.isolate = function(screenshot, element) {
  return new Promise(function(resolve, reject) {
    var position,
        dimensions;

    element.getLocation().then(function(elPos) {
      position = elPos;
      return element.getSize();
    }, function(err) {
      reject(err);
    }).then(function(elDim) {
      dimensions = elDim;
      resolve(Crop(screenshot, position, dimensions));
    }, function(err) {
      reject(err);
    });
  });
}

Metzinger.prototype.takeScreenshot = function(pageName, opts) {
  debug('Take screenshot of ' + pageName);
  var imagePath = this.pathFor('tmp', pageName);
  return new Promise(function(resolve, reject) {
    this.driver.takeScreenshot().then(function(data) {
      var buffer = new Buffer(data.replace(/^data:image\/png;base64,/,''), 'base64');
      resolve(buffer);
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
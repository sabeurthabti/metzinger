var fs = require('fs'),
    gm = require('../gm'),
    Q = require('q'),
    path = require('path'),
    LocalFiles = require('./lib/LocalFiles.js'),
    // Image = require('./lib/Image.js'),
    Comparison = require('./lib/Comparison.js');

var Metzinger = function(uid, tag, driver) {
  this.driver = driver;
  this.uid = uid;
  this.tag = tag;
  this.localFiles = new LocalFiles(uid, 'artifacts');

  console.log(this.localFiles.pathFor);

  return this;
}

Metzinger.prototype.checkVisualRegression = function(pageName, opts) {
  this._takeScreenshot(pageName, function(imagePath) {
    var referenceScreenshot = this._getReferenceScreenshotFor(pageName);

    if (!referenceScreenshot) {
      this._markAsNew(imagePath);
      throw 'New screenshot for' + pageName;
    }

    Comparison.spotDifferencesBetween(referenceScreenshot, imagePath).then(function(isEqual) {
      console.log("Screenshots %s", isEqual ? "matched" : "didn't match");
    }, function(err) {
      console.log("Something went terribly wrong: ", err);
    });


  }.bind(this));
}

//Private(ish)

Metzinger.prototype._takeScreenshot = function(pageName, cb, opts) {
  var imagePath = path.join( this.localFiles.pathFor('tmp'), this._fileNameFor(pageName) )

  this.driver.takeScreenshot().then(function(data) {
    fs.writeFile(imagePath, data.replace(/^data:image\/png;base64,/, ''), 'base64', function(err) {
      if(err) {
        throw err
      } else {
        cb(imagePath);
      }
    });
  });
}

Metzinger.prototype._getReferenceScreenshotFor = function(pageName) {
  var imagePath = path.join( this.localFiles.pathFor('ref'), this._fileNameFor(pageName) );
  if (fs.existsSync(imagePath)) {
    return imagePath;
  } else {
    return false;
  }
}

Metzinger.prototype._fileNameFor = function(pageName) {
  return pageName + '_' + this.tag + '.png';
}

Metzinger.prototype._markAsNew = function(screenshot) {
  fs.renameSync( './' + screenshot, path.join( this.localFiles.pathFor('new'), path.basename(screenshot) ));
}

Metzinger.prototype._markForReview = function(screenshot) {
  fs.renameSync('./' + screenshot, path.join( this.localFiles.pathFor('diff'), path.basename(screenshot) ));
}

Metzinger.prototype._image = function(path, opts) {

}


module.exports = Metzinger;
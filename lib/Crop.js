var Canvas = require('canvas'),
    Image = Canvas.Image,
    debug = require('debug')('isolate');

var Crop = function(imgBuffer, coords, size) {
  return new Promise(function(resolve, reject) {
    var image = new Image;

    image.onerror = reject;

    image.onload = function() {
      var canvas = new Canvas(size.width, size.height, 'png');
      var context = canvas.getContext('2d');

      debug(size);
      debug(coords);

      context.drawImage(image,
        coords.x, coords.y,
        size.width, size.height,
        0, 0,
        size.width, size.height);

      require('fs').writeFileSync('./test.png', canvas.toBuffer());
      debug(canvas);
      debug(canvas.toBuffer());
      resolve( canvas.toBuffer() );
    }
    image.src = imgBuffer;
  });
}

module.exports = Crop;
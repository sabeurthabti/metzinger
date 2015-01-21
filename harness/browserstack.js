var webdriver = require('browserstack-webdriver'),
    co = require('co'),
    Metzinger = require('../index.js');

['firefox', 'chrome'].forEach(function(browser) {
    var capabilities = {
    'browserName': browser,
    'browserstack.user': process.env.BS_USER,
    'browserstack.key': process.env.BS_KEY
  };

  var driver = new webdriver.Builder().
    usingServer('http://hub.browserstack.com/wd/hub').
    withCapabilities(capabilities).
    build();

  driver.get('http://stage-masthead.herokuapp.com');

  var metz = new Metzinger('rich', driver);


  co(metz.checkVisualRegression(browser + '-windows')).then(function(result) {
    driver.quit();
    return result;
  }, function(err) {
    driver.quit();
    throw err;
  }).then(function() {
    console.log("Ok, we're finished.")
  }).catch(onerror);
});


function onerror(err) {
  console.log(typeof(err.stack) === "undefined" ? err : err.stack);
}
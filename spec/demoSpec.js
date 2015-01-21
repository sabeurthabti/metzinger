var webdriver = require('browserstack-webdriver'),
    By = webdriver.By,
    co = require('co'),
    Metzinger = require('../index');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

var capabilities = {
  'browserstack.user': process.env.BS_USER,
  'browserstack.key': process.env.BS_KEY,
  'browser' : 'Firefox',
  'browser_version' : '33.0',
  'os' : 'Windows',
  'os_version' : '8.1',
  'resolution' : '1024x768'
};

var testString = [capabilities.os,capabilities.os_version,capabilities.browser,capabilities.browser_version].join("_").toLowerCase();

var driver = new webdriver.Builder().
  usingServer('http://hub.browserstack.com/wd/hub').
  withCapabilities(capabilities).
  build();

describe("The masthead", function() {
  var metz = new Metzinger(testString, driver);
  it("should look correct", function(done) {
    driver.get('http://stage-masthead.herokuapp.com');

    co(metz.checkVisualRegression('masthead')).then(function(result) {
      expect(result.status).toEqual(true, result.message);
      done();
    });
  });

  it("should hide the cookie banner when 'close' is clicked", function(done) {
    driver.get('http://stage-masthead.herokuapp.com');
    driver.findElement(By.css('.banner__close')).click();

    co(metz.checkVisualRegression('masthead-cookie-close')).then(function(result) {
      expect(result.status).toEqual(true, result.message);
      done();
    });
  });

  afterAll(function() {
    driver.quit();
  });
});



// var webdriver = require('browserstack-webdriver'),
//     co = require('co'),
//     Metzinger = require('../index.js');

// ['firefox'].forEach(function(browser) {
//     var capabilities = {
//     'browserName': browser,
//     'browserstack.user': process.env.BS_USER,
//     'browserstack.key': process.env.BS_KEY
//   };

//   var driver = new webdriver.Builder().
//     usingServer('http://hub.browserstack.com/wd/hub').
//     withCapabilities(capabilities).
//     build();

//   driver.get('http://stage-masthead.herokuapp.com');

//   var metz = new Metzinger('rich', driver);


//   co(metz.checkVisualRegression(browser + '-windows')).then(function(result) {
//     driver.quit();
//     return result;
//   }, function(err) {
//     driver.quit();
//     throw err;
//   }).then(function() {
//     console.log("Ok, we're finished.")
//   }).catch(onerror);
// });


function onerror(err) {
  console.log(typeof(err.stack) === "undefined" ? err : err.stack);
}
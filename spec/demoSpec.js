var webdriver = require('selenium-webdriver'),
//var webdriver = require('browserstack-webdriver'),
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

// var driver = new webdriver.Builder().
//   usingServer('http://hub.browserstack.com/wd/hub').
//   withCapabilities(capabilities).
//   build();

var driver = new webdriver.Builder().
  withCapabilities(webdriver.Capabilities.chrome()).
  build();

describe("The masthead", function() {
  var metz = new Metzinger(testString, driver);

  beforeEach(function() {
    driver.get('http://stage-masthead.herokuapp.com/demo/skycom');
  });

  describe("the header", function() {
    it("should look correct", function(done) {
      var el = driver.findElement(By.css('.skycom-header'));
      metz.checkVisualRegression('masthead-header', el).then(function(result) {
        expect(result.status).toEqual(true, result.message);
        done();
      });
    });

    it("should display the profile menu", function(done) {
      driver.findElement(By.css('[data-event=button-mobile-profile]')).click();
      var el = driver.findElement(By.css('.js-user-profile'));
      metz.checkVisualRegression('masthead-header-profile', el).then(function(result) {
        expect(result.status).toEqual(true, result.message);
        done();
      });
    });
  })
  // it("should look correct", function(done) {
  //   driver.get('http://stage-masthead.herokuapp.com');
  //   driver.manage().window().maximize();

  //   metz.checkVisualRegression('masthead').then(function(result) {
  //     expect(result.status).toEqual(true, result.message);
  //     done();
  //   });
  // });

  // it("should hide the cookie banner when 'close' is clicked", function(done) {
  //   driver.get('http://stage-masthead.herokuapp.com');
  //   driver.findElement(By.css('.banner__close')).click();

  //   metz.checkVisualRegression('masthead-cookie-close').then(function(result) {
  //     expect(result.status).toEqual(true, result.message);
  //     done();
  //   });
  // });

  afterAll(function() {
    driver.quit();
  });
});
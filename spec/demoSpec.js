var webdriver = require('browserstack-webdriver'),
    By = webdriver.By,
    Metzinger = require('../index');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

var capabilities = {
  'browserstack.user': process.env.BS_USER,
  'browserstack.key': process.env.BS_KEY,
  'browser' : 'Firefox',
  'browser_version' : '33.0',
  'os' : 'Windows',
  'os_version' : '8.1',
  'resolution' : '1920x1080'
};

var driver = new webdriver.Builder().
  usingServer('http://hub.browserstack.com/wd/hub').
  withCapabilities(capabilities).
  build();

describe("The masthead", function() {
  var metz = new Metzinger("windows-8.1-firefox", driver);

  beforeEach(function() {
    driver.get('http://stage-masthead.herokuapp.com/demo/skycom');
    driver.manage().window().setSize(800,1600);
  });

  describe("the header", function() {
    it("should look correct", function(done) {
      var el = driver.findElement(By.css('.skycom-header'));
      metz.checkVisualRegression('masthead-header', el).then(function(result) {
        expect(result.status).toEqual(true, result.message);
        done();
      });
    });
  });

  describe("the footer", function() {
    it("should look correct", function(done) {
      var el = driver.findElement(By.css('.skycom.footer'));
      metz.checkVisualRegression('masthead-footer', el).then(function(result) {
        expect(result.status).toEqual(true, result.message);
        done();
      });
    })
  });

  afterAll(function(done) {
    driver.quit().then(done())
  });
});
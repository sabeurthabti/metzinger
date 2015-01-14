var webdriver = require('browserstack-webdriver'),
    Metzinger = require('../index.js');

var capabilities = {
  'browserName': 'firefox',
  'browserstack.user': process.env.BS_USER,
  'browserstack.key': process.env.BS_KEY
};

var driver = new webdriver.Builder().
  usingServer('http://hub.browserstack.com/wd/hub').
  withCapabilities(capabilities).
  build();

driver.get('http://stage-masthead.herokuapp.com');

driver.getTitle().then(function(title) {
  console.log(title);
});

var metz = new Metzinger('abc123', 'rich', driver);
metz.checkVisualRegression('firefox-windows');

driver.quit();
// external dependencies
const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const fs = require('fs');

// internal dependencies
const githubWebhookMappings = require('../../src/mappings.json');

it('should contain fixtures for every supported GitHub webhook', function() {
  var supportedWebhooks = _.keys(githubWebhookMappings);
  var filePath;

  _.each(supportedWebhooks, function(webhookName) {
    filePath = __dirname + '/../fixtures/events/' + webhookName + '.json';
    expect(fs.existsSync(filePath)).to.equal(true);
  });
});

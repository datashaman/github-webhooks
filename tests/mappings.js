// external dependencies
const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');

// internal dependencies
const githubWebhookMappings = require('../src/mappings.json');

describe('mappings.json', function() {

  it('should not have any webhooks with the same properties', function() {
    var scannedWebhooks = [];
    var webhookProperties;
    var scannedWebhookProperties;
    var symmetricalDifference;

    // begin checking webhooks
    _.each(_.keys(githubWebhookMappings), function(webhookName) {
      webhookProperties = githubWebhookMappings[webhookName];

      // if we've not scanned anything previously
      if (scannedWebhooks.length === 0) {
        scannedWebhooks.push(webhookName);
        return;
      }

      // duplicate webhook keys would overwrite one another due to the nature
      // of JSON - thus, we don't need to test whether or not `webhookName` has 
      // been previously scanned

      // check previous scanned webhooks looking for a xor with a length greater
      // than 1
      _.each(scannedWebhooks, function(scannedWebhookName) {
        scannedWebhookProperties = githubWebhookMappings[scannedWebhookName];
        symmetricalDifference = _.xor(webhookProperties,
          scannedWebhookProperties);

        if (symmetricalDifference.length === 0) {
          throw new Error('"' + webhookName + '"" is symmetrical to "' +
            scannedWebhookName + '"');
        }
      });

      scannedWebhooks.push(webhookName);
    });
  });

});

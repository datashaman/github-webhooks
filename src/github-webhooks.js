// external dependencies
const _ = require('lodash');
const express = require('express');
const events = require('events');
const formidable = require('formidable');

// internal dependencies
const githubWebhookMappings = require('./mappings.json');

/**
 * Supported events:
 *   - error
 *   - raw
 */
function GitHubWebhooks() {
  // setup some internal variables
  this._server = express();
  this._events = new events.EventEmitter();

  // add our catch all route
  this._server.post('*', this._retrievePostedWebhookData.bind(this));
}

GitHubWebhooks.prototype.listen = function(port) {
  this._server.listen(port);
};

GitHubWebhooks.prototype._retrievePostedWebhookData = function(req, res) {
  // pull the data out of the request as its received
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields) {
    if (err) {
      this._events.emit('error', err);
      return;
    }

    // emit a raw event so developers can listen to raw posted webhook data
    // (in the event that they want to listen to something other than the
    // public events)
    this._events.emit('raw', fields);

    // try to detect this webhook by running it through our expected github
    // webhook mappings
    this._processWebhook(fields);

    // let the HTTP request finish (GitHub will report the status of POST's to
    // the specified endpoint in the webhook history)
    res.status(200).end();
  }.bind(this));
};

GitHubWebhooks.prototype._processWebhook = function(data) {
  var expectedProperties;
  var symmetricalDifference;
  var receivedProperties = _.keys(data);

  // determine the type of hook we're processing and then emit an event for that
  // hook if it has a symmetrical difference of 0
  _.each(_.keys(githubWebhookMappings), function(webhookName) {
    expectedProperties = githubWebhookMappings[webhookName];

    // compare the expected properties with the properties of the data we
    // received, looking for a symmetrical difference of 0
    symmetricalDifference = _.xor(expectedProperties, receivedProperties)
      .length;

    if (symmetricalDifference === 0) {
      // we found an expected webhook with the same properties, emit an event
      console.log('emitting event: ', webhookName);
      this._events.emit(webhookName, data);
    }

    // if there WAS a symmetrical difference (something other than 0), it means:
    // "this is not the droid you're looking for", so we move on to the next
    // webhook
  }.bind(this));

  // it is possible to reach this far and not have emitted any events. if the
  // event you're looking for is not listed in the `mappings.json` file, you'll
  // want to hook into the "raw" event and duck-punch the properties yourself
};

GitHubWebhooks.prototype.on = function(event, callback) {
  return this._events.on(event, callback);
};

exports = module.exports = GitHubWebhooks;
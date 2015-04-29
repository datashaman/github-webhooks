// external dependencies
const _ = require('lodash');
const express = require('express');
const events = require('events');
const formidable = require('formidable');
const Crypto = require('ezcrypto').Crypto;

// internal dependencies
const githubWebhookMappings = require('./mappings.json');

/**
 * Supported events:
 *   - error
 *   - raw
 *   - every event listed in 'mappings.json' (see README.md)
 */
var GitHubWebhooks = {

  // internal properties
  _server: express(),
  _events: new events.EventEmitter(),
  _serverInstance: null,

  listen: function(port) {
    this.close();
    this._serverInstance = this._server.listen(port);
  },

  close: function() {
    if (this._serverInstance && _.isFunction(this._serverInstance.close)) {
      this._serverInstance.close();
      delete this._serverInstance;
    }
  },

  _retrievePostedWebhookData: function(req, res) {
    // pull the data out of the request as its received
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
      if (err) {
        this._events.emit('error', err);
        return;
      }

      if (!this._validate(req)) {
        this._events.emit('error', 'request is invalid');
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
  },

  _validate: function(req) {
      console.log(req.headers);
      var signature = 'sha1=' + Crypto.HMAC(Crypto.SHA1, req.body, process.env.SECRET, { asString: true });
  },

  _processWebhook: function(data) {
    var expectedProperties;
    var optionalDifference;
    var symmetricalDifference;
    var receivedProperties = _.keys(data);

    // determine the type of hook we're processing and then emit an event for
    // that hook if it has a symmetrical difference of 0
    _.each(_.keys(githubWebhookMappings), function(webhookName) {
      expectedProperties = githubWebhookMappings[webhookName];

      // compare the expected properties with the properties of the data we
      // received, looking for a symmetrical difference of 0
      symmetricalDifference = _.xor(expectedProperties.required,
        receivedProperties);

      // also, compare the symmetrical difference with the optional properties
      optionalDifference = _.difference(symmetricalDifference,
        expectedProperties.optional);

      if (symmetricalDifference.length === 0) {
        // we found an expected webhook with the same properties, emit an event
        this._events.emit(webhookName, data);
      } else if (expectedProperties.optional.length > 0 &&
        optionalDifference.length === 0) {
        // the symmetrical differences were all listed within the optional
        // properties
        this._events.emit(webhookName, data);
      }

      // if there WAS a symmetrical difference (something other than 0), it
      // means: "this is not the droid you're looking for", so we move on to
      // the next webhook
    }.bind(this));

    // it is possible to reach this far and not have emitted any events. if the
    // event you're looking for is not listed in the `mappings.json` file, 
    // you'll want to hook into the "raw" event and duck-punch the properties
    // yourself
  },

  on: function(event, callback) {
    return this._events.on(event, callback);
  }

};

// setup the catch-all route for the express server
GitHubWebhooks._server.post('*', GitHubWebhooks._retrievePostedWebhookData
  .bind(GitHubWebhooks));

// expose the function object
exports = module.exports = GitHubWebhooks;

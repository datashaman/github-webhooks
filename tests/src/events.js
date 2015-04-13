// external dependencies
const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');
const sinon = require('sinon');
const supertest = require('supertest');
const sinonChai = require('sinon-chai');

// internal dependencies
const githubWebhookMappings = require('../../src/mappings.json');
const webhooks = require('../../');

// configure chai
chai.use(sinonChai);

// variables
const agent = supertest.agent(webhooks._server);
var sandbox;

beforeEach(function() {
  sandbox = sinon.sandbox.create();
});

afterEach(function() {
  sandbox.restore();
});

// generate tests for each event we support
_.each(_.keys(githubWebhookMappings), function(eventName) {

  it('emits a "' + eventName + '" event', function(done) {
    var eventData = require('../fixtures/events/' + eventName + '.json');
    var processWebhook = sandbox.spy(webhooks, '_processWebhook');
    var emit = sandbox.spy(webhooks._events, 'emit');

    agent.post('/')
      .send(eventData)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        expect(processWebhook).to.have.been.calledOnce
          .and.to.have.been.calledWith(eventData);
        expect(emit).to.have.been.calledTwice;
        expect(emit.getCall(0)).to.have.been.calledWith('raw', eventData);
        expect(emit.getCall(1)).to.have.been.calledWith(eventName, eventData);

        done();
      });
  });

});

it('still emits a "raw" event when the event is undetected', function(done) {
  var emit = sandbox.spy(webhooks._events, 'emit');
  var eventData = {};

  agent.post('/')
    .send(eventData)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      expect(emit).to.have.been.calledOnce
        .and.to.have.been.calledWith('raw', eventData);

      done();
    });
});

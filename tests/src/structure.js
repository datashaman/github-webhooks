const chai = require('chai');
const expect = chai.expect;
const webhooks = require('../..');

it('has a method `on`', function() {
  expect(webhooks).to.have.a.property('on').and.to.be.a('Function');
});

it('has a method `listen`', function() {
  expect(webhooks).to.have.a.property('listen').and.to.be.a('Function');
});

it('has a method `close`', function() {
  expect(webhooks).to.have.a.property('close').and.to.be.a('Function');
});

it('has a method `_retrievePostedWebhookData`', function() {
  expect(webhooks).to.have.a.property('_retrievePostedWebhookData')
    .and.to.be.a('Function');
});

it('has a method `_processWebhook`', function() {
  expect(webhooks).to.have.a.property('_processWebhook')
    .and.to.be.a('Function');
});

it('has a property `_serverInstance`', function() {
  expect(webhooks).to.have.a.property('_serverInstance');
});

it('has a property `_server`', function() {
  expect(webhooks).to.have.a.property('_server');
});

it('has a property `_events`', function() {
  expect(webhooks).to.have.a.property('_events');
});

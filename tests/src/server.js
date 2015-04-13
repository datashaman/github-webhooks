// external dependencies
const chai = require('chai');
const expect = chai.expect;
const webhooks = require('../..');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');

it('starts listening for webhooks correctly', function() {
  var listen = sinon.spy(webhooks._server, 'listen');

  webhooks.listen(9001);
  expect(listen).to.have.been.calledOnce.and.to.have.been.calledWith(9001);
  expect(webhooks._serverInstance).to.be.an('Object');

  webhooks._server.listen.restore();
});

it('stops listening for webhooks correctly', function() {
  var close = sinon.spy(webhooks._serverInstance, 'close');

  webhooks.close();

  expect(close).to.have.been.calledOnce;

  // we don't need to call `.restore()` on the method because it was
  // internally deleted
});

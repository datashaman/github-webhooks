// external dependencies
const _ = require('lodash');

// define some variables to work with
const preTests = [
  'mappings',
  'fixtures'
];

// ORDER MATTERS HERE; Note: The order in which the following `mainTests` are 
// required actually does matter. Why? Because certain files may have certain
// dependencies.
const mainTests = [
  'structure'
];

// run the pretests first
describe('Prerequisite Tests', function() {
  _.each(preTests, function(testPath) {
    describe(testPath, function() {
      require(__dirname + '/src/' + testPath);
    });
  });
});

// perform the main tests now
describe('Main Tests', function() {
  _.each(mainTests, function(testPath) {
    describe(testPath, function() {
      require(__dirname + '/src/' + testPath);
    });
  });
});

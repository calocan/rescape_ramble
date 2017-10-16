const {environmentConfig} = require('environments/testConfig');
const regions = require('./parisRegions.sample').default;
const users = require('./parisUsers.sample').default;
const R = require('ramda');

module.exports.parisSampleConfig = R.merge(environmentConfig, {
  regions,
  users
});

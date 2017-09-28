/**
 * Created by Andy Likuski on 2017.06.23
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {SCOPE} = require('./geojsonConfig');
module.exports.SCOPE = SCOPE;
const R = require('ramda');
// const {persistLocations, fetchLocations as fetchLocationsIO, removeLocations as removeLocationsIO} = require('async/locationIO')
// Describes the fundamental data structure being transacted in these actions
// Everything here is a geospatial data structure with a minimum set of properties such as lat, lon
const ACTION_ROOT = module.exports.ACTION_ROOT = 'locations';
const {makeActionConfigLookup, actionConfig, VERBS: {FETCH, ADD, SELECT}} = require('rescape-cycle');
const config = require('data/default/defaultConfig').default;
const {overrideSourcesWithoutStreaming, makeActionCreators} = require('rescape-cycle');

// The various action keys that define something being modeled
// Models are various manifestations of the locations
const M = R.mapObjIndexed((v, k) => R.toLower(k), {
  LOCATIONS: '',
});

const scopeKeys = module.exports.scopeKeys = ['user'];
const rootedConfig = actionConfig(ACTION_ROOT);
const userConfig = rootedConfig(scopeKeys);

const ACTION_CONFIGS = module.exports.ACTION_CONFIGS = [
  userConfig(M.LOCATIONS, FETCH),
  userConfig(M.LOCATIONS, ADD),
  userConfig(M.LOCATIONS, SELECT),
];

/**
 * cycle.js sources that process location async actions
 */
module.exports.locationCycleSources = overrideSourcesWithoutStreaming({
  CONFIG: config,
  // ACTION_CONFIG configures the generic cycleRecords to call/match the correct actions
  ACTION_CONFIG: {
    configByType: makeActionConfigLookup(ACTION_CONFIGS)
  }
});

/**
 * The actionCreators that produce the action bodies
 * @returns {Function} A function expected the scope.
 * Once the scope is passed an object keyed by action name and valued by action function is returned.
 * Each action function expects a functor (object or array) as its unary argument
 */
module.exports.actionCreators = makeActionCreators(ACTION_CONFIGS);

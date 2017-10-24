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

const {ROOT} = require('./geojsonConfig');
const R = require('ramda');
const {makeActionConfigLookup, actionConfig,
  VERBS: {FETCH, SELECT},
  overrideSourcesWithoutStreaming, makeActionCreators} = require('rescape-cycle');
const {defaultConfig} = require('data/default/defaultConfig');
const {camelCase} = require('rescape-ramda');

// Models are various manifestations of the locations
// For now just define a generic OPEN_STREET_MAP model
const {OPEN_STREET_MAP} = module.exports.MODELS =
  R.mapObjIndexed((v, k) => camelCase(R.toLower(k)), {
    OPEN_STREET_MAP: ''
  });

// Describes the fundamental data structure being transacted in these actions
// Everything here is a geospatial data structure with a minimum set of properties such as lat, lon
const scopeKeys = module.exports.scopeKeys = ['user'];
const rootedConfig = actionConfig(ROOT);
const userScopedConfig = rootedConfig(scopeKeys);

/**
 * OpenStreetMap action configurations. At this point we only support read and user state actions
 * @type {[*]}
 */
const ACTION_CONFIGS = module.exports.ACTION_CONFIGS = [
  userScopedConfig(OPEN_STREET_MAP, FETCH),
  userScopedConfig(OPEN_STREET_MAP, SELECT)
];

/**
 * cycle.js sources that process location async actions
 */
module.exports.openStreetMapCycleSources = overrideSourcesWithoutStreaming({
  CONFIG: defaultConfig,
  // ACTION_CONFIG configures the generic cycleRecords to call/match the correct actions
  ACTION_CONFIG: {
    configByType: makeActionConfigLookup(ACTION_CONFIGS)
  }
});

/**
 * The actionCreators that produce the action bodies
 * @returns {Function} A function expected the scope.
 * Once the scope is passed an object keyed by action name and valued by action function is returned.
 * Each action function expects a container (e.g, object or array) as its unary argument
 */
module.exports.actionCreators = makeActionCreators(ACTION_CONFIGS);

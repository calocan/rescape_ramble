/**
 * Created by Andy Likuski on 2017.09.29
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const {moveToKeys, mergeDeep} = require('rescape-ramda');
const PropTypes = require('prop-types');
const {v} = require('rescape-validate');
const {reqPath} = require('rescape-ramda').throwing;

/**
 * Copies the 'default' region to the keys of the specified regions, removing the default key,
 * and then deep merges.
 * @param {Object} regions keyed by key if an object and valued by region.
 * @returns {Object} The "modified" defaultConfig.regions
 */
module.exports.applyDefaultRegion = v(regions =>
    mergeDeep(
      moveToKeys(
        R.lensPath([]),
        'default',
        // Keys of obj or string indexes of array
        R.keys(regions),
        reqPath(['regions'], require('data/default').defaultConfig)
      ),
      regions
    ),
  [
    ['regions', PropTypes.oneOfType([PropTypes.shape(), PropTypes.array]).isRequired]
  ], 'applyDefaultRegion');

/**
 * Copies the defaultConfig user keys to the specified users keys, removing the defaultConfig keys
 * This basically clones a template so that it can be merged into each real user
 * The default users of the defaultConfig are copied to the given usersKeys within the defaultConfig,
 * producing a new defaultConfig to merge with the target config
 * @param {Object} defaultUserKeyToUserObjs Maps each default user key of interest to a list of
 * target user keyed objects.
 * E.g.  {
 * {[APP_ADMIN]: {
 *  'phil': {...}
 *  'barbara': {...}
 * }
 * {[MANAGER]: {
 *  'ken': {...}
 *  'billy': {...}
 * }
 * }
 * @returns {Object} The "modified" defaultConfig.users merged into the defaultUserKeyToUserObjs
 */
module.exports.mapDefaultUsers = v(defaultUserKeyToUserObjs => {
    const defaultUsers = reqPath(['users'], require('data/default').defaultConfig);
    return R.mapObjIndexed(
      (users, defaultUserKey) => R.map(
        user => mergeDeep(reqPath([defaultUserKey], defaultUsers), user),
        users
      ),
      defaultUserKeyToUserObjs
    );
  },
  [
    ['defaultUserKeyToUserKeys', PropTypes.shape().isRequired]
  ], 'mapDefaultUsers'
);

/**
 * Converts any number of strings to [{string1: {id: string1}, string2: {id: string2}].
 * This is used for associations when only one or a few are expected.
 * @param {Array} args The keys to transform
 * @returns {Object} The object keyed by ids
 */
module.exports.keysAsIdObj = (...args) => R.fromPairs(R.map(key => [key, {id: key}], args));


/**
 * Apply the given regions to the users. This conveniently sets each user to have access to all given regions
 * in the config. It also sets isSelected to the first region for each user
 * @param {Object} regions An object of regions, the keys are assumed to be the ids
 * @param {Object} users An object keyed by user id and valued by user
 * @returns {Object} users with regions key set to a list of id objects (e.g. [{id: 1}, {id: 2}, ...]
 */
module.exports.applyRegionsToUsers = (regions, users) =>
  R.map(
    user => R.set(
      R.lensPath(['regions']),
      R.addIndex(R.map)(
        (id, index) => R.merge(
          {id},
          // Set the first region to isSelected true
          R.ifElse(R.equals(0), R.always({isSelected: true}), R.always({}))(index)),
        R.keys(regions)),
      user),
    users);


// module.exports.applyUserSettings = (lens, settings)

module.exports.wrapLocationsWithFeatures = (locations, locationFeatures) =>
  R.mapObjIndexed((locationsByType, locationType) =>
      R.set(R.lensProp('geojson'), reqPath(), locationType),
    locations
  );



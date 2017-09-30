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
const {duplicateKey} = require('rescape-ramda');

/**
 * Copies the 'default' region to the specified region keys.
 * This basically clones a template so that it can be merged into each real region
 * The default region of this config is copied to the given regionKeys
 * @param {[String]} regionKeys The region keys to target.
 * @param {Object} defaultConfig The defaultConfig being merged into another config
 * @returns {Object} The "modified" defaultConfig
 */
module.exports.mapDefaultRegion = R.curry((regionKeys, defaultConfig) =>
  duplicateKey(R.lensPath(['regions']), 'default', regionKeys, defaultConfig)
);

/**
 * Copies the defaultConfig user keys to the specified users keys.
 * This basically clones a template so that it can be merged into each real user
 * The default users of the defaultConfig are copied to the given usersKeys within the defaultConfig,
 * producing a new defaultConfig to merge with the target config
 * @param {Object} defaultUserKeyToUserKeys Maps each default user key of interest to a list of
 * target user keys
 * @param {Object} defaultConfig The defaultConfig being merged into the target config
 * @returns {Object} The "modified" defaultConfig
 */
module.exports.mapDefaultUsers = R.curry((defaultUserKeyToUserKeys, defaultConfig) =>
  R.set(
    R.lensProp(['users']),
    // for each pair duplicate the users object, adding the desired userKeys. Merge them
    // all together
    R.reduce((accumulated, [defaultUserKey, userKeys]) => duplicateKey(R.lensPath([]), defaultUserKey, userKeys, accumulated),
      R.prop('users', defaultConfig),
      R.toPairs(defaultUserKeyToUserKeys)
    ),
    defaultConfig
  )
);

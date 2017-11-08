/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const {toImmutable} = require('helpers/immutableHelpers');
const {PropTypes} = require('prop-types');
const {v} = require('rescape-validate');

/**
 * Returns an initialState based on the given region config. It's possible to configure the state
 * to have multiple regions, but this function only assumes a single initial region
 * @param {Object} config The config
 * @return {Object} The state
 */
module.exports.default = v(config => {
    return {
      // Current browser properties
      browser: R.propOr({}, 'browser', config),
      settings: config.settings,
      regions: R.map(region => R.merge(region, {
          // The viewport must be an Immutable to satisfied the redux-map-gl reducer
          // Apply toImmutable to the viewport of config.mapbox
          mapbox: R.over(
            R.lensProp('viewport'),
            toImmutable,
            // Merge the initial mapbox configuration into each region
            R.merge(
              config.settings.mapbox,
              region.mapbox
            )
          )
        }),
        config.regions
      ),
      users: config.users,
      styles: config.styles
    };
  },
  [
    ['config', PropTypes.shape({
      settings: PropTypes.shape({
        mapbox: PropTypes.shape().isRequired
      }).isRequired,
      regions: PropTypes.shape().isRequired
    }).isRequired]
  ], 'initialState.default');


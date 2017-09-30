/**
 * Created by Andy Likuski on 2017.06.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const {asyncActions} = require('rescape-cycle');
const {ROOT} = require('redux/geojson/geojsonConfig');
const ACTION_ROOT = 'transit';
const actions = asyncActions(ROOT, ACTION_ROOT, 'FETCH');

/**
 * Reduces openStreetMaps state
 * @param {Object} state The state
 * @param {Object} action The action
 * @returns {Object} the reduced state
 */
module.exports = {
  default: (state = {}, action = {}) => {
    switch (action.type) {
      case actions.fetchTransitRequest:
        // TODO handle with reselect in containers instead
        // Indicate that the geojson has been requested so that it never tries to lad again
        return R.merge(state, {requested: true});
      case actions.fetchTransitSuccess:
        // Merge the returned geojson into the state
        return R.merge(state, action.body);
      default:
        return state;
    }
  }
};

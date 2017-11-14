/**
 * Created by Andy Likuski on 2017.02.07
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {combineReducers} = require('redux');
const geojsonReducer = require('redux/geojson/geojsonReducer').default;
const {createViewportReducer} = require('redux-map-gl');
const R = require('ramda');
const {SET_STATE} = require('redux/fullStateReducer');

/**
 * @param {Object<String, Region>} state The regions reducer reduces an object keyed by Region id
 * @param {String} state.regionId The id of the region

 * @param {Object} action The action
 * @return {Object} The reduced state
 */
module.exports.default = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_STATE:
      return R.merge(state, action.state.users || {});
    default:
      return state;
  }
};


/**
 * Action creator that sets the full state
 * @param {Object} state The state
 * @returns {Object} the Action
 */
module.exports.setState = function setState(state) {
  return {type: SET_STATE, state};
};

/**
 * Created by Andy Likuski on 2016.05.24
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {SET_STATE} = require('redux/fullStateReducer');
const R = require('ramda');
const SET_CURRENT = module.exports.SET_CURRENT = '/settings/SET_CURRENT';

/**
 * Reduces the state of the settings
 * @param {Object} state The state
 *  {} (default) Use default value for each setting
 *  {aSetting: true|false, ...} Pass desired value of setting
 * @param {String} action SET_STATE, SET_CURRENT, etc
 * @returns {Object} The reduced state
 */
module.exports.default = function (state = {}, action) {
  // If setting state
  if (action.type === SET_STATE) {
    return R.merge(state, action.state.settings);
  } else if (action.type === SET_CURRENT) {
    return R.merge(state, action.state.settings);
  }
  return state;
};

/**
 * Action creator that sets the full state
 * @param {Object} state The state
 * @returns {Object} the Action
 */
module.exports.setState = function setState(state) {
  return {type: SET_STATE, state};
};

/**
 * Action creator that sets the current Region
 * @param {String} regionKey The key of the Region to be made the current Region
 * @returns {Object} the action
 */
module.exports.setCurrent = function setCurrent(regionKey) {
  return {type: SET_CURRENT, regionKey};
};

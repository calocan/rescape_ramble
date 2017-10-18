/**
 * Created by Andy Likuski on 2017.10.17
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { createSelector, createSelectorCreator, defaultMemoize } = require('reselect');
const R = require('ramda');
const {propLensEqual} = require('./componentHelpers');

const {stateSelector, createLengthEqualSelector} = require('./reselectHelpers')

describe('reselectHelpers', () => {
  test('stateSelector', () => {
    const theState = {
      settings: 'pie',
      data: 'à la mode'
    };
    expect(
      stateSelector(
        state => state.settings,
        state => state.data
      )(theState)
    ).toEqual(
      {
        settings: 'pie',
        data: 'à la mode'
      }
    )
  });

  test('createLengthEqualSelector', () => {

  });
});

/**
 * A selector that expects a settingsSelector and dataSelector,
 * returning a stateSelector the creates a data structure with top-level
 * keys of settings and data for a Component to consume as props
 * @param {Function} settingsSelector The settings for the component--normally configured options
 * that don't change often
 * @param {Function} dataSelector Data that the component will display, both directly from the
 * state and derived from state data
 * @returns {Function} A reselect selector that is called with state and props and returns
 * a props object for a component with the top-level keys settings and data
 */
module.exports.stateSelector = (settingsSelector, dataSelector) => createSelector(
  [
    settingsSelector,
    dataSelector,
  ],
  (settings, data) => ({settings, data})
);

/**
 * Compares the length of two values
 */
module.exports.createLengthEqualSelector = createSelectorCreator(
  defaultMemoize,
  propLensEqual(R.lensProp('length'))
);
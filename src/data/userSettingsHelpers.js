/**
 * Created by Andy Likuski on 2017.10.18
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const {filterWithKeys, mapPropValueAsIndex, mergeDeep} = require('rescape-ramda');

/** *
 * Given the state and userSettings which map the shape of state,
 * and a lens that winnows in on a certain property that is a container (i.e. list or keyed objects)
 * Merge matching values of the state and userSettings for each value of the container
 * and apply the given predicate on the result.
 *
 * The predicate checks properties appended to the userSettings version of the data, such as
 * checking for keys like 'isSelected' or 'willDelete' or 'willAdd'
 * @param {Function} lens Ramda lens to winnow in on the property to be filtered
 * @param {Function} predicate Predicate that expects each merged value of the container of the lens
 * for the state and userSettings. It's possible for a value to only exist in the state and not
 * in the userSettings (and possibly visa-versa if the user is creating something new). These will
 * be included in the merge and run through the predicate
 * @param {Object} state The Redux state. Important: The target of the lens
 * @param {Object} userSettings The user settings that match the shape of the state
 * @returns {*} The filtered merged value pointed to by the lens
 *
 * Example:
 * lens R.lensPath(['foos', 'bars'])
 * predicate value => value.isSelected
 * state: {foos: {bars: [{id: 'bar1', name: 'Bar 1'}, {id: 'bar2', name: 'Bar 2'}]}}
 * userSettings: {foos: {bars: {bar1: {id: 'bar1', isSelected: true}, bar2: {id: 'bar2'}}}}
 * returns: {bar1: {id: 'bar1', name: 'Bar 1' isSelected: true}}
 */
module.exports.filterMergeByUserSettings = (lens, predicate, state, userSettings) =>
  filterWithKeys(
    (value, key) => {
      return predicate(
        value
      );
    },
    // Combine the lens focused userValue and state value
    // Make sure each is keyed by id before merging
    mergeDeep(
      ...R.map(R.compose(mapPropValueAsIndex('id'), R.view(lens)), [state, userSettings])
    )
  );

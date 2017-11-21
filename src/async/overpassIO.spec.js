/**
 * Created by Andy Likuski on 2017.04.03
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {fetchTransit} = require('./overpassIO');
const {removeDuplicateObjectsByProp} = require('rescape-ramda');
const {expectTask} = require('helpers/jestHelpers');
const fs = require('fs');
const {LA_SAMPLE, LA_BOUNDS} = require('async/queryOverpass.sample');

let mock;
mock = false;
jest.unmock('query-overpass');
//mock = true; jest.mock('query-overpass');

// requires are used below since the jest includes aren't available at compile time
describe('overpassHelpersUnmocked', () => {
  if (mock) {
    return;
  }
  const realBounds = [-118.24031352996826, 34.04298753935195, -118.21018695831297, 34.065209887879476];
  test('unmockedFetchTransit', async () => {
    expect.assertions(1);
    // Unmocked integration test
    await expectTask(
      // We expect over 500 results. I'll leave it fuzzy in case the source dataset changes
      fetchTransit({realBounds}, realBounds).map(response => response.features.length > 500)
    ).resolves.toBe(true);
  }, 1000000);
  test('unmockedFetchTransitCelled', async () => {
    expect.assertions(1);
    // Wrap the Task in a Promise for jest's sake
    await expectTask(
      fetchTransit({cellSize: 2, bounds: realBounds, sleepBetweenCalls: 1000}, realBounds).map(
        // We expect over 500 results. I'll leave it fuzzy in case the source dataset changes
        response => response.features.length > 500
      )
    ).resolves.toBe(true);
  }, 1000000);
});

describe('overpassHelpers', () => {
  if (!mock) {
    return;
  }

  const bounds = LA_BOUNDS;
  test('fetchTransit', async () => {
    expect.assertions(1);
    // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
    await expectTask(
      fetchTransit({testBounds: bounds}, bounds)
    ).resolves.toEqual(LA_SAMPLE);
  });

  test('fetchTransit in cells', async () => {
    expect.assertions(1);
    await expectTask(
      fetchTransit({cellSize: 200, testBounds: bounds}, bounds).map(response => response.features)
    ).resolves.toEqual(
      // the sample can have duplicate ids
      removeDuplicateObjectsByProp('id', LA_SAMPLE.features)
    );
  });
});


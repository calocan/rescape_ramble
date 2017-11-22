/**
 * Created by Andy Likuski on 2017.07.31
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRA/ACNTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const R = require('ramda');
const {makeSampleInitialState} = require('helpers/jestHelpers');
const {throwing: {reqPath}} = require('rescape-ramda');
const {assertSourcesSinks, cycleRecords} = require('rescape-cycle');
const xs = require('xstream').default;
const {
  locationCycleSources,
  makeSampleActionsAndResponses
} = require('./locationActions');

const state = makeSampleInitialState();
// Create sample request and response bodies
const {
  responses: {fetchLocationsRequestBody, addLocationsRequestBody, fetchLocationsSuccessBody, addLocationsSuccessBody},
  actions,
  newObjs: {locations: newLocations},
  savedObjs: {locations: savedLocations}
} = makeSampleActionsAndResponses(state);

describe('cycleRecords', () => {
  test('User can add and fetch locations', (done) => {
    // Override the async and config drivers for testing
    const testSources = R.merge(
      // Our configs are always single event streams
      R.map(source => ({a: source}), locationCycleSources),
      {
        // User intends to add locations
        // User intents to fetch locations
        ACTION: {
          a: actions.addLocationsRequest(newLocations),
          c: actions.fetchLocationsRequest(savedLocations)
        },
        // Response to addLocationsRequest with addLocationsSuccessBody
        // Response to fetchLocationsRequest with fetchLocationsSuccessBody
        HTTP: {
          select: () => ({
            g: xs.of(addLocationsSuccessBody),
            h: xs.of(fetchLocationsSuccessBody)
          })
        }
      });

    const sinks = {
      // In response to the addLocationsRequest and fetchLocationsRequest actions,
      // we expect to sink the following HTTP requests
      HTTP: {
        r: addLocationsRequestBody,
        s: fetchLocationsRequestBody
      },
      ACTION: {
        // In response to the HTTP sources return add and fetch response,
        // we expect to syn these action successes
        m: actions.addLocationsSuccess({data: savedLocations}),
        n: actions.fetchLocationsSuccess({data: savedLocations})
      }
    };

    // Override the source drivers with our fake sources
    assertSourcesSinks({
      ACTION: {'-a---c----|': testSources.ACTION},
      HTTP: {'---g---h--|': testSources.HTTP},
      ACTION_CONFIG: {'a|': testSources.ACTION_CONFIG},
      CONFIG: {'a|': testSources.CONFIG}
    }, {
      HTTP: {'-r---s----|': sinks.HTTP},
      ACTION: {'---m---n--|': sinks.ACTION}
    }, cycleRecords, done, {interval: 200});
  });
});

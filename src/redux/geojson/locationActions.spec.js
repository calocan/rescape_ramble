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
const {assertSourcesSinks, sampleCycleSourcesForDiagramTests, actions} = require('rescape-cycle');
const xs = require('xstream').default;
const {cycleLocations, sam} = require('./locationActions');
const {reqPath} = require('rescape-ramda').throwing;
const {fetchLocationsRequestBody, addLocationsRequestBody, fetchLocationsResponseSuccess, addCitiesResponseSuccess} = require('test/sampleRequests');

describe('cycleRecords', () => {
  test('add and fetch', (done) => {
    // Override the async and config drivers for testing
    const testSources = {
      // In Response to the addCitiesRequest and fetchCitiesRequest actions
      // We get the following HTTP responses as sources
      HTTP: {
        // We ignore the argument to select, the category, since we only have one category
        select: () => ({
          g: xs.of(addCitiesResponseSuccess),
          h: xs.of(fetchCitiesResponseSuccess)
        })
      },
      ACTION: {
        // User intends to store cities. Omit ids to simulate an add
        a: actions.addCitiesRequest(R.values(R.omit(['id'], cities))),

        // User intents to fetch cities
        c: actions.fetchCitiesRequest(cities)
      },
      CONFIG: {
        a: reqPath(['CONFIG'], sampleCycleSourcesForDiagramTests)
      },
      ACTION_CONFIG: {
        a: reqPath(['ACTION_CONFIG'], sampleCycleSourcesForDiagramTests)
      }
    };

    const sinks = {
      // In response to the addCitiesRequest and fetchCitiesRequest actions,
      // we expect to sink the following HTTP requests
      HTTP: {
        r: addCitiesRequestBody,
        s: fetchCitiesRequestBody
      },
      ACTION: {
        // In response to the HTTP sources return add and fetch response,
        // we expect to syn these action successes
        m: actions.addCitiesSuccess({data: cities}),
        n: actions.fetchCitiesSuccess({data: cities})
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
    }, cycleLocations, done, {interval: 200});
  });
});
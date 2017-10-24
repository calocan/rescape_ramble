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

const {createSelector, createSelectorCreator, defaultMemoize} = require('reselect');
const R = require('ramda');
const {propLensEqual} = require('./componentHelpers');
const {
  ESTADO: {IS_ACTIVE, IS_SELECTED},
  stateSelector, createLengthEqualSelector, activeUserSelector, makeRegionSelector, makeFeaturesByTypeSelector, makeMarkersByTypeSelector, regionsSelector, dataSelector
} = require('./reselectHelpers');

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
    );
  });

  test('createLengthEqualSelector', () => {
    let state = {foo: [1, 2, 3]};
    const myMockFn = jest.fn()
      .mockImplementation(state => state.foo);
    const selector = createLengthEqualSelector(
      [
        myMockFn
      ],
      R.identity
    );
    selector(state);
    state = R.set(R.lensPath(['foo', 0]), 11, state);
    selector(state);
    expect(myMockFn.mock.calls.length).toEqual(2);
  });

  test('activeUserSelector', () => {
    const state = {
      users: {
        yuk: {name: 'Yuk'},
        dum: {name: 'Duk', [IS_ACTIVE]: true}
      }
    };
    expect(activeUserSelector(state)).toEqual({dum: {name: 'Duk', [IS_ACTIVE]: true}});
  });

  test('makeRegionSelector', () => {
    const region = {
      geojson: {
        osm: {
          features: [
            {
              type: 'Feature',
              id: 'way/29735335',
              properties: {
                '@id': 'way/29735335'
              }
            }
          ]
        },
        markers: {
          features: [
            {
              id: 'node/3572156993',
              properties: {
                '@id': 'node/3572156993'
              }
            }
          ]
        }
      }
    };
    const expected =
      R.merge(region, {
        geojson: {
          osm: {
            featuresByType: makeFeaturesByTypeSelector()(region),
            markersByType: makeMarkersByTypeSelector()(region)
          }
        }
      });
    expect(makeRegionSelector()(region)).toEqual(expected);
  });

  test('regionsSelector', () => {
    const state = {
      regions: {
        foo: {},
        boo: {id: 'boo'}
      },
      users: {
        blinky: {
          [IS_ACTIVE]: true,
          regions: {foo: {id: 'foo'}, boo: {id: 'boo', [IS_SELECTED]: true}}
        },
        pinky: {}
      }
    };
    // only the selected region of the active user should be selected
    const expected = {
      boo: {
        id: 'boo',
        [IS_SELECTED]: true,
        // These are created by the derived data selectors
        geojson: {osm: {featuresByType: {}, markersByType: {}}}
      }
    };
    expect(regionsSelector(state)).toEqual(expected);
  });

  test('dataSelector', () => {
    const state = {
      users: {
        blinky: {
          [IS_ACTIVE]: true,
          regions: {foo: {id: 'foo'}, boo: {id: 'boo', [IS_SELECTED]: true}}
        }
      },
      regions: {boo: 'yah'}
    };

    const expected = {
      regions: {
        boo: {
          id: 'boo',
          [IS_SELECTED]: true,
          // These are created by the derived data selectors
          geojson: {osm: {featuresByType: {}, markersByType: {}}}
        }
      }
    };
    expect(dataSelector(state)).toEqual(expected);
  });
});



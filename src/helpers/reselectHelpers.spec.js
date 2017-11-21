/**
 * Created by Andy Likuski on 2017.10.17
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const {
  ESTADO: {IS_ACTIVE, IS_SELECTED},
  makeActiveUserAndRegionStateSelector, createLengthEqualSelector, activeUserSelector, makeRegionSelector, makeFeaturesByTypeSelector,
  makeMarkersByTypeSelector, regionsSelector, makeViewportsSelector, mapboxSettingsSelector, browserDimensionsSelector,
  makeBrowserProportionalDimensionsSelector, mergeStateAndProps, makeMergeDefaultStyleWithProps, makeMergeContainerStyleProps,
  makeGeojsonsSelector, makeGeojsonLocationsSelector
} = require('./reselectHelpers');

describe('reselectHelpers', () => {
  test('makeActiveUserAndRegionStateSelector', () => {
    expect(
      makeActiveUserAndRegionStateSelector()({
        settings: 'dessert',
        regions: {
          pie: {
            id: 'pie'
          }
        },
        users: {blinky: {name: 'Blinky', [IS_ACTIVE]: true, regions: {pie: {id: 'pie', [IS_SELECTED]: true}}}}
      })
    ).toEqual(
      {
        settings: 'dessert',
        regions: {
          pie: {
            id: 'pie',
            geojson: {osm: {featuresByType: {}, locationsByType: {}}},
            [IS_SELECTED]: true
          }
        },
        users: {blinky: {name: 'Blinky', [IS_ACTIVE]: true, regions: {pie: {id: 'pie', [IS_SELECTED]: true}}}}
      }
    );
  });

  // TODO createLengthEqualSelector is not memoizing as expected
  test('createLengthEqualSelector', () => {
    let state = {foo: [1, 2, 3]};
    // Mock function that simply returns foo
    const myMockFn = jest.fn()
      .mockImplementation(state => {
        return state.foo;
      });
    // createLengthEqualSelector should only track changes to foo's length, not its contents
    const selector = createLengthEqualSelector(
      [myMockFn],
      R.identity
    );
    // Initial call to selector
    selector(state);
    // Subsequent call to selector with length of lens target changed
    state = R.set(R.lensPath(['foo', 3]), 11, state);
    selector(state);
    expect(myMockFn.mock.calls.length).toEqual(2);
    // Subsequent call to selector with lens target changed but not length
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
        locations: {
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
            locationsByType: makeMarkersByTypeSelector()(region)
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
        geojson: {osm: {featuresByType: {}, locationsByType: {}}}
      }
    };
    expect(regionsSelector(state)).toEqual(expected);
  });

  const regionsState = {
    regions: {
      foo: {
        mapbox: {
          viewport: {some: 'thing'}
        },
        geojson: {
          some: 'thing',
          locations: {
            someLocation: 'ok'
          }
        }
      },
      boo: {
        mapbox: {
          viewport: {what: 'ever'}
        },
        geojson: {
          what: 'ever',
          locations: {
            someLocation: 'sure'
          }
        }
      }
    },
    users: {
      blinky: {
        [IS_ACTIVE]: true,
        regions: {foo: {id: 'foo'}, boo: {id: 'boo', [IS_SELECTED]: true}}
      }
    }
  };

  test('makeViewportsSelector', () => {
    const expected = {
      boo: {
        what: 'ever'
      }
    };
    const viewportSelector = makeViewportsSelector();
    expect(viewportSelector(regionsState)).toEqual(expected);
  });

  test('makeGeojsonsSelector', () => {
    const expected = {
      boo: {
        what: 'ever',
        // These default derived properties are expected for each region
        osm: {
          featuresByType: {},
          locationsByType: {}
        }
      }
    };
    const viewportSelector = makeGeojsonsSelector();
    expect(viewportSelector(regionsState)).toEqual(expected);
  });

  test('makeGeojsonLocationsSelector', () => {
    // Exepect the contents of the geojson.locations of the active region
    const expected = {
      boo: {
        someLocation: 'sure'
      }
    };
    const viewportSelector = makeGeojsonLocationsSelector();
    expect(viewportSelector(regionsState)).toEqual(expected);
  });

  test('mapboxSettingSelector', () => {
    const state = {
      settings: {
        mapbox: {
          showCluster: true,
          showZoomControls: true,
          perspectiveEnabled: true,
          preventStyleDiffing: false
        }
      }
    };
    const expected = {
      showCluster: true,
      showZoomControls: true,
      perspectiveEnabled: true,
      preventStyleDiffing: false
    };
    expect(mapboxSettingsSelector(state)).toEqual(expected);
  });
  test('browserDimensionSelector', () => {
    const state = {
      browser: {
        width: 640,
        height: 480
      }
    };
    const expected = {
      width: 640,
      height: 480
    };
    expect(browserDimensionsSelector(state)).toEqual(expected);
  });

  test('makeBrowserProportionalDimensionsSelector', () => {
    const state = {
      browser: {
        width: 640,
        height: 480
      }
    };
    const props = {
      style: {
        width: 0.5,
        height: 0.1
      }
    };
    const expected = {
      width: 320,
      height: 48
    };
    expect(makeBrowserProportionalDimensionsSelector()(state, props)).toEqual(expected);
  });

  test('mergeStateAndProps', () => {
    const state = {
      buster: 1,
      gob: 2,
      lindsay: {
        tobias: 1
      },
      michael: 4
    };
    const props = {
      lindsay: {
        maeby: 3
      }
    };
    expect(R.compose((state, props) => state, mergeStateAndProps)(state, props))
      .toEqual({
        buster: 1,
        gob: 2,
        michael: 4,
        lindsay: {
          tobias: 1,
          maeby: 3
        }
      });
  });

  test('makeMergeDefaultStyleWithProps', () => {
    const state = {
      styles: {
        default: {
          color: 'red',
          margin: 2
        }
      }
    };
    const props = {
      style: {
        color: 'blue',
        margin: R.multiply(2)
      }
    };
    expect(makeMergeDefaultStyleWithProps()(state, props)).toEqual(
      {
        color: 'blue',
        margin: 4
      }
    );
  });

  test('makeMergeContainerStyleProps', () => {
    const containerProps = {
      style: {
        color: 'red',
        margin: 2
      }
    };

    const style = {
      color: 'blue',
      margin: R.multiply(2)
    };

    expect(makeMergeContainerStyleProps()(containerProps, style)).toEqual(
      {
        color: 'blue',
        margin: 4
      }
    );
  });
});



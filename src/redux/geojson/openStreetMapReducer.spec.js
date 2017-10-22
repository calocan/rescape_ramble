/**
 * Created by Andy Likuski on 2017.06.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const configureStore = require('redux-mock-store');
const {actions, actionCreators} = require('redux/geojson/openStreetMapReducer');
const thunk = require('redux-thunk').default;
const {expectTask, testState} = require('helpers/jestHelpers');
const {removeDuplicateObjectsByProp} = require('rescape-ramda');
const R = require('ramda');
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const state = testState();
jest.mock('query-overpass');

describe('openStreetMaps', () => {
    test('fetchTransit', async () => {
        const bounds = require('query-overpass').LA_BOUNDS;
        const store = mockStore(state);
        const expectedActions = [
            { type: actions.FETCH_TRANSIT_DATA },
            {
                type: actions.FETCH_TRANSIT_SUCCESS,
                body: R.over( // remove features with the same id
                    R.lens(R.prop('features'), R.assoc('features')),
                    removeDuplicateObjectsByProp('id'))(require('queryOverpassResponse').LA_SAMPLE)
            }
        ];

        // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
        await expectTask(
            store.dispatch(actionCreators.fetchTransit(
                {cellSize: store.getState().settings.overpass.cellSize, testBounds: bounds},
                bounds
            )).map(() => store.getActions())
        ).resolves.toEqual(expectedActions);
    });
});

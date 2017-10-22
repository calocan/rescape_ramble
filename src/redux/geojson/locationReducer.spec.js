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

const {sampleConfig} = require('data/samples/sampleConfig');
const initialState = require('data/initialState').default;
const {actionTypes} = require('redux/geojson/geojsonReducer');
const {setState} = require('redux/fullStateReducer');
const {expectTask} = require('helpers/jestHelpers');
const {LA_SAMPLE} = require('data/samples/oakland-sample/oaklandLocations.sample');
const {ROOT} = require('redux/geojson/geojsonConfig');
const {ACTION_ROOT} = require('locationActions');
const {asyncActionCreators} = require('redux/actionHelpers');
const Task = require('data.task');
const thunk = require('redux-thunk').default;
const configureMockStore = require('redux-mock-store');
const {LA_BOUNDS} = require('async/queryOverpass.sample');
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
// Mock the asynchronous actionCreator
const {fetchLocationsData} = asyncActionCreators(ROOT, ACTION_ROOT, 'FETCH', () => Task.of(LA_SAMPLE));
const {removeLocationsData} = asyncActionCreators(ROOT, ACTION_ROOT, 'REMOVE', () => Task.of(LA_SAMPLE));
const {updateLocationsData} = asyncActionCreators(ROOT, ACTION_ROOT, 'UPDATE', () => Task.of(LA_SAMPLE));

describe('locations reducer', () => {
    const state = initialState(sampleConfig);
    test('should fetch locations', () => {
        // We need a real store to test PouchDb
        const store = mockStore();
        store.dispatch(setState(initialState(sampleConfig)));
        const bounds = LA_BOUNDS;
        const expectedActions = [
            { type: actionTypes.FETCH_LOCATIONS_DATA },
            { type: actionTypes.FETCH_LOCATIONS_SUCCESS, body: LA_SAMPLE}
        ];

        expectTask(store.dispatch(fetchLocationsData(
            {testBounds: bounds},
            state.regions.currentKey,
            bounds
        )).map(() => store.getActions())).resolves.toEqual(expectedActions);
    });

    test('should update locations', () => {
        const store = mockStore();
        store.dispatch(setState(initialState(sampleConfig)));
        const bounds = LA_BOUNDS;
        const expectedActions = [
            { type: actionTypes.UPDATE_LOCATIONS_DATA },
            { type: actionTypes.UPDATE_LOCATIONS_SUCCESS, body: LA_SAMPLE}
        ];

        expectTask(
            store.dispatch(updateLocationsData(
                state.regions.currentKey,
                {testBounds: bounds},
                LA_SAMPLE)))
            .map(() => {
                return store.getActions();
            }).resolves.toEqual(expectedActions);
    });
});

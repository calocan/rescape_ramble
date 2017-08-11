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

const testConfig = require('store/data/test/config').default;
const initialState = require('store/data/initialState').default;
const {actionTypes} = require('./geojsons');
const {stopSync} = require('store/async/pouchDbIO');
const {setState} = require('store/reducers/fullStates');
const {expectTask} = require('helpers/jestHelpers');
const {LA_SAMPLE} = require('store/async/markerIO.sample');
const {SCOPE} = require('./geojsons');
const {ACTION_KEY} = require('store/reducers/geojson/markerActions');
const {asyncActionCreators} = require('store/reducers/actionHelpers');
const Task = require('data.task');
const thunk = require('redux-thunk');
const configureMockStore = require('redux-mock-store');
const {LA_BOUNDS} = require('store/async/queryOverpass.sample');
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
// Mock the asynchronous actionCreator
const {fetchMarkersData} = asyncActionCreators(SCOPE, ACTION_KEY, 'FETCH', () => Task.of(LA_SAMPLE));
const {removeMarkersData} = asyncActionCreators(SCOPE, ACTION_KEY, 'REMOVE', () => Task.of(LA_SAMPLE));
const {updateMarkersData} = asyncActionCreators(SCOPE, ACTION_KEY, 'UPDATE', () => Task.of(LA_SAMPLE));

describe('markers reducer', () => {
    const state = initialState(testConfig);
    it('should fetch markers', () => {
        // We need a real store to test PouchDb
        const store = mockStore();
        store.dispatch(setState(initialState(testConfig)));
        const bounds = LA_BOUNDS;
        const expectedActions = [
            { type: actionTypes.FETCH_MARKERS_DATA },
            { type: actionTypes.FETCH_MARKERS_SUCCESS, body: LA_SAMPLE}
        ];

        expectTask(store.dispatch(fetchMarkersData(
            {testBounds: bounds},
            state.regions.currentKey,
            bounds
        )).map(() => store.getActions())).resolves.toEqual(expectedActions);
    });

    it('should update markers', () => {
        const store = mockStore();
        store.dispatch(setState(initialState(testConfig)));
        const bounds = LA_BOUNDS;
        const expectedActions = [
            { type: actionTypes.UPDATE_MARKERS_DATA },
            { type: actionTypes.UPDATE_MARKERS_SUCCESS, body: LA_SAMPLE}
        ];

        expectTask(
            store.dispatch(updateMarkersData(
                state.regions.currentKey,
                {testBounds: bounds},
                LA_SAMPLE)))
            .map(() => {
                stopSync(state.regions.currentKey);
                return store.getActions();
            }).resolves.toEqual(expectedActions);
    });
});

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

import testConfig from 'store/data/test/config';
import initialState from 'store/data/initialState';
import {actionTypes} from './geojsons';
import {stopSync} from 'store/async/pouchDbIO';
import {setState} from 'store/reducers/fullStates';
import {expectTask} from 'helpers/jestHelpers';
import {LA_SAMPLE} from 'store/async/markerIO.sample'
import {SCOPE} from './geojsons'
import {ACTION_KEY} from 'store/reducers/geojson/markerActions'
import {asyncActionCreators} from 'store/reducers/actionHelpers';
import Task from 'data.task';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import {LA_BOUNDS} from 'store/async/queryOverpass.sample'
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
// Mock the asynchronous actionCreator
const {fetchMarkersData} = asyncActionCreators(SCOPE, ACTION_KEY, 'FETCH', () => Task.of(LA_SAMPLE));
const {removeMarkersData} = asyncActionCreators(SCOPE, ACTION_KEY, 'REMOVE', () => Task.of(LA_SAMPLE));
const {updateMarkersData} = asyncActionCreators(SCOPE, ACTION_KEY, 'UPDATE', () => Task.of(LA_SAMPLE));

describe('markers reducer', () => {
    const state = initialState(testConfig)
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
        )).map(() => store.getActions())).resolves.toEqual(expectedActions)
    })

    it('should update markers', () => {
        const store = mockStore()
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
                console.log('Finished updateMarkers')
                stopSync(state.regions.currentKey)
                return store.getActions()
            }).resolves.toEqual(expectedActions)
    })
});

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
import configureStore from 'redux-mock-store';
import {mapPropValueAsIndex} from 'helpers/functions';
import {actions} from './geojsons';
import {fetchMarkers, removeMarkers, updateMarkers} from 'store/reducers/geojson/markers';
import {stopSync} from 'store/async/pouchDb';
import {setState} from 'store/reducers/fullState';
import thunk from 'redux-thunk';
import {expectTask} from 'helpers/jestHelpers';
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const toObjectKeyedById = mapPropValueAsIndex('id');

describe('markers reducer', () => {
    const state = initialState(testConfig)
    it('should fetch markers', () => {
        // We need a real store to test PouchDb
        const store = makeStore();
        store.dispatch(setState(initialState(testConfig)));
        const bounds = require('query-overpass').LA_BOUNDS;
        const expectedActions = [
            { type: actions.FETCH_MARKERS_DATA },
            { type: actions.FETCH_MARKERS_SUCCESS, body: markersSample}
        ]

        expectTask(store.dispatch(fetchMarkers(
            {testBounds: bounds},
            state.regions.currentKey,
            bounds
        )).map(() => store.getActions())).resolves.toEqual(expectedActions)
    })

    it('should update markers', () => {
        // We need a real store to test PouchDb
        const store = makeStore();
        store.dispatch(setState(initialState(testConfig)));
        const bounds = require('query-overpass').LA_BOUNDS;
        const expectedActions = [
            { type: actions.UPDATE_MARKERS_DATA },
            { type: actions.UPDATE_MARKERS_SUCCESS, body: markersSample}
        ];

        expectTask(
            store.dispatch(removeMarkers(
                {testBounds: bounds},
                state.regions.currentKey))
                .chain(response => store.dispatch(updateMarkers(
                    state.regions.currentKey,
                    {testBounds: bounds},
                    markersSample.features)))
                .map(() => {
                    console.log('Finished updateMarkers')
                    stopSync(state.regions.currentKey)
                    return store.getActions()
                })).resolves.toEqual(expectedActions)
    })
});

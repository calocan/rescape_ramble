/**
 * Created by Andy Likuski on 2017.04.27
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {Map} from 'immutable'
import testConfig from 'store/data/test/config'
import initialState from 'store/data/initialState'
import configureStore from 'redux-mock-store';
import {getPath, mapPropValueAsIndex} from 'helpers/functions'
import R from 'ramda'
import reducer, {stopSync, ftchOsm, removeMarkers, fetchMarkers, updateMarkers, actions} from './geojson';
import {setState} from 'store/reducers/fullState'
import thunk from 'redux-thunk'
import {expectTask} from 'helpers/jestHelpers'
import {LA_SAMPLE as markersSample} from 'helpers/markerHelpers.sample'
import makeStore from 'store'
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const toObjectKeyedById = mapPropValueAsIndex('id');

jest.unmock('query-overpass');
const DB_PATH = '__tests__/geojson/'
describe('geojson reducer', () => {
    const state = initialState(testConfig)
    it('should return the initial state', () => {
        expect(
            Map(reducer(testConfig.id, DB_PATH, 'initial_state')(
                getPath(['regions', state.regions.currentKey, 'geojson'], state),
                {})
            ).toJS()
        ).toEqual(R.map(toObjectKeyedById, testConfig.geojson))
    });
    it('should fetch osm', () => {
        const bounds = require('query-overpass').LA_BOUNDS;
        const store = mockStore(initialState(testConfig));
        const expectedActions = [
            { type: actions.FETCH_OSM_DATA },
            { type: actions.FETCH_OSM_SUCCESS, body: require('queryOverpassResponse').LA_SAMPLE}
        ]

        // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
        expectTask(store.dispatch(fetchOsm(
            {cellSize: store.getState().settings.overpass.cellSize, testBounds: bounds},
            bounds
        )).map(() => store.getActions())).resolves.toEqual(expectedActions)
    })
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
                {testBounds: bounds},
                state.regions.currentKey,
                markersSample.features)))
            .map(() => {
                console.log('Finished updateMarkers')
                stopSync(state.regions.currentKey)
                return store.getActions()
            })).resolves.toEqual(expectedActions)
    })
});

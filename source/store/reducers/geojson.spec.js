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
import reducer, {fetchOsm, actions} from './geojson';
import thunk from 'redux-thunk'
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const toObjectKeyedById = mapPropValueAsIndex('id');

jest.mock('query-overpass');

describe('geojson reducer', () => {
    const state = initialState(testConfig)
    it('should return the initial state', () => {
        expect(
            Map(reducer(
                getPath(['regions', state.regions.currentKey, 'geojson'], state),
                {})
            ).toJS()
        ).toEqual(R.map(toObjectKeyedById, testConfig.geojson))
    });
    it('should fetch geojson', () => {
        const bounds = require('query-overpass').LA_BOUNDS;
        const store = mockStore(initialState(testConfig));
        const expectedActions = [
            { type: actions.FETCH_OSM_DATA },
            { type: actions.FETCH_OSM_SUCCESS, body: require('queryOverpassResponse').LA_SAMPLE}
        ]

        // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
        store.dispatch(fetchOsm(
            {cellSize: store.getState().settings.overpass.cellSize, testBounds: bounds},
            bounds
        )).fork(
            reject => {
                throw new Error(reject.message)
            },
            response => {
                expect(store.getActions()).toEqual(
                    expectedActions
                )
            },
        )
    })
});

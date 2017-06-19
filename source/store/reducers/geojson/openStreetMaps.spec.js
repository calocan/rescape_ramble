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
import {fetchTransit, actions } from 'store/reducers/geojson/openStreetMaps';
import thunk from 'redux-thunk';
import {expectTask} from 'helpers/jestHelpers';
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('geojson reducer', () => {
    it('should fetch osm', () => {
        const bounds = require('query-overpass').LA_BOUNDS;
        const store = mockStore(initialState(testConfig));
        const expectedActions = [
            { type: actions.FETCH_TRANSIT_DATA },
            { type: actions.FETCH_TRANSIT_SUCCESS, body: require('queryOverpassResponse').LA_SAMPLE}
        ];

        // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
        expectTask(store.dispatch(fetchTransit(
            {cellSize: store.getState().settings.overpass.cellSize, testBounds: bounds},
            bounds
        )).map(() => store.getActions())).resolves.toEqual(expectedActions)
    })
});

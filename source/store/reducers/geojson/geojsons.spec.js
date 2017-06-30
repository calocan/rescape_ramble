/**
 * Created by Andy Likuski on 2017.04.27
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {Map} from 'immutable';
import testConfig from 'store/data/test/config';
import initialState from 'store/data/initialState';
import {getRequiredPath, mapPropValueAsIndex} from 'helpers/functions';
import R from 'ramda';
import reducer, {actions, fetchMarkers, ftchOsm, removeMarkers, stopSync, updateMarkers} from './geojsons';
import {setState} from 'store/reducers/fullStates';
const toObjectKeyedById = mapPropValueAsIndex('id');

describe('geojson reducer', () => {
    const state = initialState(testConfig)
    it('should return the initial state', () => {
        expect(
            Map(reducer()(
                getRequiredPath(['regions', state.regions.currentKey, 'geojson'], state),
                {})
            ).toJS()
        ).toEqual(R.map(toObjectKeyedById, testConfig.geojson))
    });
});

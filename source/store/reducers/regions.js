/**
 * Created by Andy Likuski on 2017.02.07
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { combineReducers } from 'redux';
import geojsonReducer from './geojson'
import {createViewportReducer} from 'redux-map-gl';
import R from 'ramda';
import {SET_STATE} from './fullState'
import {Map} from 'immutable'
import {copy} from 'helpers/functions'

const SET_MODE = '/settings/SET_MODE';
const SET_SUBJECT = '/settings/SET_SUBJECT';


const regionReducer = combineReducers({
    geojson: geojsonReducer,
    mapbox: createViewportReducer()
});

const regionsReducer = (
    state = { }, action = {}
) => {

    switch (action.type) {
        case SET_STATE:
            return R.merge(state, action.state['regions'] || {});
        default:
            // Delegate all other actions to the current Region's reducer
            // This lens points to the state of the current Region
            const currentRegionLens = R.lensPath([state.currentKey]);
            return state.currentKey ? R.set(
                currentRegionLens,
                regionReducer(
                    // Only pass the region state keys that are handled by the regionReducer
                    R.pick(['geojson', 'mapbox'], R.view(currentRegionLens, state)),
                    action),
                // Deep copy state for a deep path R.set to prevent mutation of state
                copy(state)
            ): state;
    }
};


export default regionsReducer;

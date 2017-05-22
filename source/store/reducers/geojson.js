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

import R from 'ramda';
import {SET_STATE} from './fullState'
import {Map} from 'immutable'
import {fetchTransitCelled, fetchTransit} from 'helpers/overpassHelpers'
import Task from 'data.task'

const FETCH_OSM = '/osm/FETCH_OSM';
const FETCH_OSM_DATA = '/osm/FETCH_OSM_DATA';
const FETCH_OSM_SUCCESS = '/osm/FETCH_OSM_SUCCESS';
const FETCH_OSM_FAILURE = '/osm/FETCH_OSM_FAILURE';
export const actions = {FETCH_OSM, FETCH_OSM_DATA, FETCH_OSM_SUCCESS, FETCH_OSM_FAILURE};


/**
 @typedef Geojson
 @type {Object}
 @property {[Number]} bounds A four element array representing the bounds [min lon, min lat, max lon, max lat]
 */


/***
 *
 * @param state geojson data from OpenStreetMap
 * @param action
 * @return {*}
 */
const geojsonReducer = (
    state = { }, action = {}
) => {

    switch (action.type) {
        case SET_STATE:
            return R.merge(state, action.state.geojson);
        case FETCH_OSM_SUCCESS:
            return R.merge(state, action.value)
        default:
            return state;
    }
};

/***
 * Action to request the full state
 * @return {{type: string}}
 */
function fetchOsmData() {
    return {
        type: FETCH_OSM_DATA
    }
}

/***
 * Action to process the successful response
 * @param body
 * @return {{type: string, body: *}}
 */
function fetchOsmSuccess(body) {
    return {
        type: FETCH_OSM_SUCCESS,
        body
    }
}

/***
 * Action to process the failure response
 * @param ex
 * @return {{type: string, ex: *}}
 */
function fetchOsmFailure(ex) {
    return {
        type: FETCH_OSM_FAILURE,
        ex
    }
}


/***
 * Asynchronous call to fetch OSM data from user the overhead api
 * @param {Object} options:
 * @param options.cellSize: Pass the cellSize in kilometers here
 * @param {[Number]} bounds
 * @return {function(*)}
 * fetchOsm:: <k,v> -> [a] -> Task Error String
 */
export function fetchOsm(options, bounds) {
    return dispatch => {
        dispatch(fetchOsmData());
        return fetchTransit(options, bounds).chain(response =>
            Task.of(dispatch(fetchOsmSuccess(response)))
        )
    }
}

export default geojsonReducer;


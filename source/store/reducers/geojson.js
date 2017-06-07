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
import {fetchTransitCelled} from 'helpers/overpassHelpers'
import {fetchMarkers as fetchMarkersHelper, sync} from 'helpers/markerHelpers'
import Task from 'data.task'
import PouchDB from 'pouchdb'

const FETCH_OSM = '/osm/FETCH_OSM';
const FETCH_OSM_DATA = '/osm/FETCH_OSM_DATA';
const FETCH_OSM_SUCCESS = '/osm/FETCH_OSM_SUCCESS';
const FETCH_OSM_FAILURE = '/osm/FETCH_OSM_FAILURE';
const FETCH_MARKERS = '/osm/FETCH_MARKER';
const FETCH_MARKERS_DATA = '/osm/FETCH_MARKER_DATA';
const FETCH_MARKERS_SUCCESS = '/osm/FETCH_MARKER_SUCCESS';
const FETCH_MARKERS_FAILURE = '/osm/FETCH_MARKER_FAILURE';
export const actions = {
    FETCH_OSM, FETCH_OSM_DATA, FETCH_OSM_SUCCESS, FETCH_OSM_FAILURE,
    FETCH_MARKERS, FETCH_MARKERS_DATA, FETCH_MARKERS_SUCCESS, FETCH_MARKERS_FAILURE
};
const name = 'markers';
const db = new PouchDB(name);
const remoteUrl = `http://localhost:5984/${name}`;
const syncObject = sync({db, remoteUrl});

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
            // Currently never used but could be. State is set in the region reducer
            return R.merge(state, action.state.geojson);
        case FETCH_OSM_DATA:
            // Indicate that the geojson has been requested so that it never tries to lad again
            return R.merge(state, {osmRequested: true});
        case FETCH_MARKERS_DATA:
            // Indicate that the geojson has been requested so that it never tries to lad again
            return R.merge(state, {markersRequested: true});
        case FETCH_OSM_SUCCESS:
            // Merge the returned geojson into the state
            return R.merge(state, {osm: action.body});
        case FETCH_MARKERS_SUCCESS:
            // Merge the returned geojson into the state
            return R.merge(state, {markers: action.body});
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
        return fetchTransitCelled(options, bounds).chain(response =>
            Task.of(dispatch(fetchOsmSuccess(response)))
        )
    }
}

/***
 * Asynchronous call to fetch marker data
 * @param {Object} options:
 * @param {[Number]} bounds
 * @return {function(*)}
 * fetchOsm:: <k,v> -> [a] -> Task Error String
 */
export function fetchMarkers(options, bounds) {
    return dispatch => {
        dispatch(fetchMarkersData());
        return fetchMarkersHelper(db, options, bounds).chain(response =>
            Task.of(dispatch(fetchMarkersSuccess(response)))
        )
    }
}

/***
 * Action to request the full state
 * @return {{type: string}}
 */
function fetchMarkersData() {
    return {
        type: FETCH_MARKERS_DATA
    }
}

/***
 * Action to process the successful response
 * @param body
 * @return {{type: string, body: *}}
 */
function fetchMarkersSuccess(body) {
    return {
        type: FETCH_MARKERS_SUCCESS,
        body
    }
}

/***
 * Action to process the failure response
 * @param ex
 * @return {{type: string, ex: *}}
 */
function fetchmarkerFailure(ex) {
    return {
        type: FETCH_MARKERS_FAILURE,
        ex
    }
}

export default geojsonReducer;


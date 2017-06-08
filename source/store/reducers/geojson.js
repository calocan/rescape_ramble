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

import R from 'ramda';
import {SET_STATE} from './fullState'
import {fetchTransitCelled} from 'helpers/overpassHelpers'
import {fetchMarkers as fetchMarkersHelper, persistMarkers, sync, remoteUrl} from 'helpers/markerHelpers'
import Task from 'data.task'
import PouchDB from 'pouchdb'
import { persistentReducer, reinit } from 'redux-pouchdb-plus';

const FETCH_OSM = '/osm/FETCH_OSM';
const FETCH_OSM_DATA = '/osm/FETCH_OSM_DATA';
const FETCH_OSM_SUCCESS = '/osm/FETCH_OSM_SUCCESS';
const FETCH_OSM_FAILURE = '/osm/FETCH_OSM_FAILURE';

const FETCH_MARKERS = '/geojson/FETCH_MARKER';
const FETCH_MARKERS_DATA = '/geojson/FETCH_MARKER_DATA';
const FETCH_MARKERS_SUCCESS = '/geojson/FETCH_MARKER_SUCCESS';
const FETCH_MARKERS_FAILURE = '/geojson/FETCH_MARKER_FAILURE';

const UPDATE_MARKERS = '/geojson/UPDATE_MARKERS';
const UPDATE_MARKERS_DATA = '/geojson/UPDATE_MARKERS_DATA';
const UPDATE_MARKERS_SUCCESS = '/geojson/UPDATE_MARKERS_SUCCESS';
const UPDATE_MARKERS_FAILURE = '/geojson/UPDATE_MARKERS_FAILURE';

export const actions = {
    FETCH_OSM, FETCH_OSM_DATA, FETCH_OSM_SUCCESS, FETCH_OSM_FAILURE,
    FETCH_MARKERS, FETCH_MARKERS_DATA, FETCH_MARKERS_SUCCESS, FETCH_MARKERS_FAILURE,
    UPDATE_MARKERS, UPDATE_MARKERS_DATA, UPDATE_MARKERS_SUCCESS, UPDATE_MARKERS_FAILURE
};

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
        case UPDATE_MARKERS_SUCCESS:
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
function fetchMarkerFailure(ex) {
    return {
        type: FETCH_MARKERS_FAILURE,
        ex
    }
}

/***
 * Asynchronous call to update MarkerList
 * @param {Object} options:
 * @param {[Feature]} markers: Features representing markers
 * @return {function(*)}
 * updateMarkers:: <k,v> -> [f] Task Error String
 */
export function updateMarkers(options, markers) {
    return dispatch => {
        dispatch(updateMarkersData());
        persistMarkers(db, options, markers).chain(response =>
            Task.of(dispatch(updateMarkersSuccess(response)))
        )
    }
}

/***
 * Action to update the markers
 * @return {{type: string}}
 */
function updateMarkersData() {
    return {
        type: UPDATE_MARKERS_DATA
    }
}

/***
 * Action to process the successful markers update
 * @param body
 * @return {{type: string, body: *}}
 */
function updateMarkersSuccess(body) {
    return {
        type: UPDATE_MARKERS_SUCCESS,
        body
    }
}

// Enhance the geojsonReducer with the persistentReducer
// The reducer must be initialized with its region name to give it the correct db
export default regionName => persistentReducer(geojsonReducer, {
    db: regionName,
    onInit: (reducerName, reducerState, store) => {
        // Called when this reducer was initialized
        // (the state was loaded from or saved to the
        // database for the first time or after a reinit action).
        const syncObject = sync({db, remoteUrl:remoteUrl(regionName)});
    },
    onUpdate: (reducerName, reducerState, store) => {
        // Called when the state of reducer was updated with
        // data from the database.
        // Cave! The store still contains the state before
        // the updated reducer state was applied to it.
    },
    onSave: (reducerName, reducerState, store) => {
        // Called every time the state of this reducer was
        // saved to the database.
    }
});


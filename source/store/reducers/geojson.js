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
import {fetchMarkers as fetchMarkersHelper, removeMarkers as removeMarkersHelper, persistMarkers, sync, remoteUrl} from 'helpers/markerHelpers'
import Task from 'data.task'
import { persistentReducer, reinit } from 'redux-pouchdb-plus';
import PouchDB from 'pouchdb'
import xhr from 'xhr';

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

const REMOVE_MARKERS = '/geojson/REMOVE_MARKERS';
const REMOVE_MARKERS_DATA = '/geojson/REMOVE_MARKERS_DATA';
const REMOVE_MARKERS_SUCCESS = '/geojson/REMOVE_MARKERS_SUCCESS';
const REMOVE_MARKERS_FAILURE = '/geojson/REMOVE_MARKERS_FAILURE';

const SEARCH_LOCATION = '/geojson/SEARCH_LOCATION';
const SEARCH_LOCATION_DATA = '/geojson/SEARCH_LOCATION_DATA';
const SEARCH_LOCATION_SUCCESS = '/geojson/SEARCH_LOCATION_SUCCESS';
const SEARCH_LOCATION_FAILURE = '/geojson/SEARCH_LOCATION_FAILURE';

const SELECT_MARKER = '/geojson/SELECT_MARKER';
const HOVER_MARKER = '/geojson/HOVER_MARKER';

export const actions = {
    FETCH_OSM, FETCH_OSM_DATA, FETCH_OSM_SUCCESS, FETCH_OSM_FAILURE,
    FETCH_MARKERS, FETCH_MARKERS_DATA, FETCH_MARKERS_SUCCESS, FETCH_MARKERS_FAILURE,
    UPDATE_MARKERS, UPDATE_MARKERS_DATA, UPDATE_MARKERS_SUCCESS, UPDATE_MARKERS_FAILURE,
    REMOVE_MARKERS, REMOVE_MARKERS_DATA, REMOVE_MARKERS_SUCCESS, REMOVE_MARKERS_FAILURE,
    SEARCH_LOCATION, SEARCH_LOCATION_DATA, SEARCH_LOCATION_SUCCESS, SEARCH_LOCATION_FAILURE,
    SELECT_MARKER, HOVER_MARKER
};
// A reference to our PouchDb instances keyed by region name
const dbs = {};
const syncs = {};
const DB_PATH = '__db__/geojson/'
const DB_PREFIX = ''
export const createDb = (regionName, dbPath, dbPrefix) => {
    const name = regionName; //`${dbPath}${dbPrefix}${regionName}`;
    dbs[regionName] = new PouchDB(name);
    return dbs[regionName];
};
export const startSync = (db, regionName) => {
    syncs[regionName] = sync({db, remoteUrl: remoteUrl(regionName)});
    return syncs[regionName]
}
export const stopSync = (regionName) => {
    syncs[regionName].cancel()
}
export const getDb = regionName => {
    return dbs[regionName]
}

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

    const sortById = R.sortBy(R.prop('id'));
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
            return R.merge(state, {markers: R.map(R.prop('doc'), sortById(action.body.rows))});
        case UPDATE_MARKERS_SUCCESS:
            // Merge the returned geojson into the state
            return R.merge(state, {markers: R.map(R.prop('doc'), sortById(action.body.rows))});
        case REMOVE_MARKERS_SUCCESS:
            // Merge the returned geojson into the state
            return R.merge(state, {markers: R.map(R.prop('doc'), sortById(action.body.rows))});
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
export function fetchOsmFailure(ex) {
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
 * @param {String} regionName:
 * @param {[Number]} bounds
 * @return {function(*)}
 * fetchOsm:: <k,v> -> [a] -> Task Error String
 */
export function fetchMarkers(options, regionName, bounds) {
    return dispatch => {
        dispatch(fetchMarkersData());
        return fetchMarkersHelper(getDb(regionName), options, bounds).chain(response =>
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
export function fetchMarkerFailure(ex) {
    return {
        type: FETCH_MARKERS_FAILURE,
        ex
    }
}

/***
 * Asynchronous call to update MarkerList
 * @param {Object} options:
 * @param {Object} regionName
 * @param {[Feature]} markers: Features representing markers
 * @return {function(*)}
 * updateMarkers:: <k,v> -> [f] Task Error String
 */
export function updateMarkers(options, regionName, markers) {
    return dispatch => {
        dispatch(updateMarkersData());
        return persistMarkers(getDb(regionName), options, markers).map(response =>
            dispatch(updateMarkersSuccess(response))
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

/***
 * Asynchronous call to remove markers
 * @param {Object} options:
 * @param {String} regionName:
 * @param {[Feature]} markers: Optional Features representing markers or null to remove all
 * @return {function(*)}
 * updateMarkers:: <k,v> -> [f] Task Error String
 */
export function removeMarkers(options, regionName, markers) {
    return dispatch => {
        dispatch(removeMarkersData());
        return removeMarkersHelper(getDb(regionName), options, markers).map(response =>
            dispatch(removeMarkersSuccess(response))
        )
    }
}

/***
 * Action to remove the markers
 * @return {{type: string}}
 */
function removeMarkersData() {
    return {
        type: REMOVE_MARKERS_DATA
    }
}

/***
 * Action to process the successful markers removal
 * @param body
 * @return {{type: string, body: *}}
 */
function removeMarkersSuccess(body) {
    return {
        type: REMOVE_MARKERS_SUCCESS,
        body
    }
}

export function removeMarkersFailure(ex) {
    return {
        type: REMOVE_MARKERS_FAILURE,
        ex
    }
}

export function searchLocation(endpoint, source, accessToken, proximity, query) {
    return dispatch => new Task((reject, response) => {
        const searchTime = new Date();
        const uri = `${endpoint}/geocoding/v5/${source}/${encodeURIComponent(query)}.json?access_token=${accessToken}${(proximity ? '&proximity=' + proximity : '')}`;
        xhr({
            uri: uri,
            json: true
        }, function (err, res, body) {
            if (err)
                reject(err)
            else {
                dispatch(searchLocationSuccess(body));
                response(res, body, searchTime)
            }
        });
    });
}

function searchLocationSuccess(body) {
    return {
        type: SEARCH_LOCATION_SUCCESS,
        body
    }
}

export function searchLocationFailure(ex) {
    return {
        type: SEARCH_LOCATION_FAILURE,
        ex
    }
}

/***
 * Action to process the successful markers removal
 * @param info
 * @return {{type: string, body: *}}
 */
export function selectMarker(info) {
    return {
        type: SELECT_MARKER,
        info
    }
}

/***
 * Action to process the successful markers removal
 * @param info
 * @return {{type: string, body: *}}
 */
export function hoverMarker(info) {
    return {
        type: HOVER_MARKER,
        info
    }
}

// Enhance the geojsonReducer with the persistentReducer
// The reducer must be initialized with its region name to give it the correct db
export default (regionName, dbPath=DB_PATH, dbPrefix=DB_PREFIX) => {
    const db = createDb(regionName, dbPath, dbPrefix);
    startSync(db, regionName);
    return persistentReducer(geojsonReducer, {
        db,
        onReady: (store) => {
            // Called when all reducers are initialized (also after
            // a reinit for all reducers is finished).
            console.log('onReady')
        },
        onInit: (reducerName, reducerState, store) => {
            // Called when this reducer was initialized
            // (the state was loaded from or saved to the
            // database for the first time or after a reinit action).
            console.log('onInit')
        },
        onUpdate: (reducerName, reducerState, store) => {
            // Called when the state of reducer was updated with
            // data from the database.
            // Cave! The store still contains the state before
            // the updated reducer state was applied to it.
            console.log('onUpdate')
        },
        onSave: (reducerName, reducerState, store) => {
            // Called every time the state of this reducer was
            // saved to the database.
            console.log('onSave')
        }
    });
}


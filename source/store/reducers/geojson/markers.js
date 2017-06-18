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
import R from 'ramda'
import {persistMarkers, fetchMarkers as fetchMarkersIO, removeMarkers as removeMarkersIO} from 'store/async/markerIO'
import {getDb} from 'store/async/pouchDb';
import Task from 'data.task';
const PREFIX = 'geojson';
const actionId = action => `/${PREFIX}/${R.toUpper(action)}`;

const asyncActionIds = (action, crud = 'FETCH') => {
    const name = `${PREFIX}/${R.toUpper(action)}`;
    return [
        `${crud}_/${name}`,
        `${crud}_/${name}_DATA`,
        `${crud}_/${name}_SUCCESS`,
        `${crud}_/${name}_FAILURE`,
    ];
}

let FETCHES, UPDATES, REMOVES
const [FETCH_MARKERS, FETCH_MARKERS_DATA, FETCH_MARKERS_SUCCESS, FETCH_MARKERS_FAILURE] = FETCHES = asyncActionIds('MARKER');
const [UPDATE_MARKERS, UPDATE_MARKERS_DATA, UPDATE_MARKERS_SUCCESS, UPDATE_MARKERS_FAILURE] = UPDATES = asyncActionIds('MARKER', 'UPDATE');
const [REMOVE_MARKERS, REMOVE_MARKERS_DATA, REMOVE_MARKERS_SUCCESS, REMOVE_MARKERS_FAILURE] = REMOVES = asyncActionIds('MARKER', 'REMOVE');

const SELECT_MARKER = actionId('SELECT_MARKER');
const HOVER_MARKER = actionId('HOVER_MARKER');
export const actions = R.flatten([FETCHES, UPDATES, REMOVES, SELECT_MARKER, HOVER_MARKER]);


/***
 * Action to request the full state
 * @return {{type: string}}
 */
const fetchMarkersData = () => ({ type: FETCH_MARKERS_DATA });

/***
 * Action to process the successful response
 * @param body
 * @return {{type: string, body: *}}
 */
const fetchMarkersSuccess = (body) => ({ type: FETCH_MARKERS_SUCCESS, body });

/***
 * Asynchronous call to fetch marker data
 * @param {Object} options:
 * @param {String} regionName:
 * @param {[Number]} bounds
 * @return {function(*)}
 * fetchOsm:: <k,v> -> [a] -> d -> Task Error String
 */
export const fetchMarkers = (options, regionName, bounds) => dispatch => {
    dispatch(fetchMarkersData());
    return fetchMarkersIO(
        getDb(regionName), options, bounds).chain(response =>
        Task.of(dispatch(fetchMarkersSuccess(response)))
    )
};

/***
 * Action to process the failure response
 * @param ex
 * @return {{type: string, ex: *}}
 */
export const fetchMarkerFailure = ex => ({ type: FETCH_MARKERS_FAILURE, ex });

/***
 * Action to update the markers
 * @return {{type: string}}
 */
const updateMarkersData = () => ({ type: UPDATE_MARKERS_DATA });

/***
 * Action to process the successful markers update
 * @param body
 * @return {{type: string, body: *}}
 */
const updateMarkersSuccess = (body) => ({ type: UPDATE_MARKERS_SUCCESS, body });

/***
 * Asynchronous call to update MarkerList
 * @param {Object} options:
 * @param {Object} regionName
 * @param {[Feature]} markers: Features representing markers
 * @return {function(*)}
 * updateMarkers:: <k,v> -> d -> [f] Task Error String
 */
export const updateMarkers = (options, regionName, markers) => dispatch => {
    dispatch(updateMarkersData());
    return persistMarkers(getDb(regionName), options, markers).map(response =>
        dispatch(updateMarkersSuccess(response))
    )
};

/***
 * Action to remove the markers
 * @return {{type: string}}
 */
const removeMarkersData = () => ({ type: REMOVE_MARKERS_DATA });

/***
 * Action to process the successful markers removal
 * @param body
 * @return {{type: string, body: *}}
 */
const removeMarkersSuccess = body => ({ type: REMOVE_MARKERS_SUCCESS, body });

/***
 * Asynchronous call to remove markers
 * @param {Object} options:
 * @param {String} regionName:
 * @param {[Feature]} markers: Optional Features representing markers or null to remove all
 * @return {function(*)}
 * updateMarkers:: <k,v> -> d -> [f] Task Error String
 */
export const removeMarkers = (options, regionName, markers) => dispatch => {
    dispatch(removeMarkersData());
    return removeMarkersIO(getDb(regionName), options, markers).map(response =>
        dispatch(removeMarkersSuccess(response))
    );
};

export const removeMarkersFailure = ex => ({ type: REMOVE_MARKERS_FAILURE, ex });

/***
 * Action to process the successful markers removal
 * @param info
 * @return {{type: string, body: *}}
 */
export const selectMarker = info => ({ type: SELECT_MARKER, info });

/***
 * Action to process the successful markers removal
 * @param info
 * @return {{type: string, body: *}}
 */
export const hoverMarker = info => ({ type: HOVER_MARKER, info });

export default (state = {}, action = {}) => {

    const sortById = R.sortBy(R.prop('id'));
    const merge = R.merge(state);
    switch (action.type) {
        case FETCH_MARKERS_DATA:
            // Indicate that the geojson has been requested so that it never tries to lad again
            // TODO use reselect in container instead of this silly state management
            return R.merge(state, {markersRequested: true});
        case FETCH_MARKERS_SUCCESS:
            // Merge the returned geojson into the state
            return merge({markers: R.map(R.prop('doc'), sortById(action.body.rows))});
        case UPDATE_MARKERS_SUCCESS:
            // Merge the returned geojson into the state
            return merge({markers: R.map(R.prop('doc'), sortById(action.body.rows))});
        case REMOVE_MARKERS_SUCCESS:
            // Merge the returned geojson into the state
            return merge({markers: R.map(R.prop('doc'), sortById(action.body.rows))});
        default:
            return state
    }
};

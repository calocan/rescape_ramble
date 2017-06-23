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
import {actionId, asyncActions, asyncActionHandlers} from 'store/reducers/reducerHelpers'

const SCOPE = 'geojson';
const ACTION = 'markers';
const makeAsyncActions = asyncActions(SCOPE, ACTION);
const makeAction = actionId(SCOPE);
const makeAsyncActionHandlers = asyncActionHandlers(SCOPE, ACTION);

let FETCHES, UPDATES, REMOVES;
// Define Actions
const {FETCH_MARKERS_DATA, FETCH_MARKERS_SUCCESS, FETCH_MARKERS_FAILURE} = FETCHES = makeAsyncActions('FETCH');
const {UPDATE_MARKERS_DATA, UPDATE_MARKERS_SUCCESS, UPDATE_MARKERS_FAILURE} = UPDATES = makeAsyncActions('UPDATE');
const {REMOVE_MARKERS_DATA, REMOVE_MARKERS_SUCCESS, REMOVE_MARKERS_FAILURE} = REMOVES = makeAsyncActions('REMOVE');

// Export in actions object
export const actions = R.mergeAll([FETCHES, UPDATES, REMOVES, {
    SELECT_MARKER: makeAction('SELECT_MARKER'),
    HOVER_MARKER: makeAction('HOVER_MARKER')
}]);

// Define Action Handlers
const {fetchMarkers, fetchMarkersData, fetchMarkersSuccess, fetchMarkersFailure} = makeAsyncActionHandlers('FETCH', fetchMarkersIO);
const {updateMarkers, updateMarkersData, udpateMarkersSuccess, updateMarkersFailure} = makeAsyncActionHandlers('UPDATE', persistMarkers);
const {removeMarkers, removeMarkersData, removeMarkersSuccess, removeMarkersFailure} = makeAsyncActionHandlers('REMOVE', removeMarkersIO);
// Export all Action Handlers
export const actionCreators = {
    fetchMarkers, fetchMarkersData, fetchMarkersSuccess, fetchMarkersFailure,
    updateMarkers, updateMarkersData, udpateMarkersSuccess, updateMarkersFailure,
    removeMarkers, removeMarkersData, removeMarkersSuccess, removeMarkersFailure
};


// TODO not wired up
export const selectMarker = info => ({ type: SELECT_MARKER, info });
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

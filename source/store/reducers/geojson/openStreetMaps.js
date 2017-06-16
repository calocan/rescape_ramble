/**
 * Created by Andy Likuski on 2017.06.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Task from 'data.task'
import R from 'ramda'
import {fetchTransitCelled} from 'store/async/overpassIO'

const FETCH_OSM = '/osm/FETCH_OSM';
const FETCH_OSM_DATA = '/osm/FETCH_OSM_DATA';
const FETCH_OSM_SUCCESS = '/osm/FETCH_OSM_SUCCESS';
const FETCH_OSM_FAILURE = '/osm/FETCH_OSM_FAILURE';

/***
 * Action to request the full state
 * @return {{type: string}}
 */
const fetchOsmData = () => ({ type: FETCH_OSM_DATA });

/***
 * Action to process the successful response
 * @param body
 * @return {{type: string, body: *}}
 */
const fetchOsmSuccess = body => ({ type: FETCH_OSM_SUCCESS, body });

/***
 * Action to process the failure response
 * @param ex
 * @return {{type: string, ex: *}}
 */
export const fetchOsmFailure = ex => ({ type: FETCH_OSM_FAILURE, ex });


/***
 * Asynchronous call to fetch OSM data from user the overhead api
 * @param options.cellSize: Pass the cellSize in kilometers here
 * @param {[Number]} bounds
 * @return {function(*)}
 * fetchOsm:: <k,v> -> [a] -> d -> Task Error String
 */
export const fetchOsm = (options, bounds) => dispatch => {
    // TODO move to async
    dispatch(fetchOsmData());
    return fetchTransitCelled(options, bounds).chain(response =>
        Task.of(dispatch(fetchOsmSuccess(response)))
    )
};

export default (state = {}, action = {}) => {
    switch (action.type) {
        case FETCH_OSM_DATA:
            // TODO handle with reselect in containers instead
            // Indicate that the geojson has been requested so that it never tries to lad again
            return R.merge(state, {requested: true});
        case FETCH_OSM_SUCCESS:
            // Merge the returned geojson into the state
            return R.merge(state, action.body);

        default:
            return state;
    }
};
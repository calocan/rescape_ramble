/**
 * Created by Andy Likuski on 2017.06.23
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {SCOPE} from './geojsons'
import R from 'ramda'
import {actionId, asyncActions, asyncActionCreators} from 'store/reducers/actionHelpers'
import {persistMarkers, fetchMarkers as fetchMarkersIO, removeMarkers as removeMarkersIO} from 'store/async/markerIO'

export const ACTION_NAME = 'markers';
const makeAsyncActionCreators = asyncActionCreators(SCOPE, ACTION_NAME);
const makeAsyncActions = asyncActions(SCOPE, ACTION_NAME);
export {SCOPE};
const makeAction = name => ({name: actionId(SCOPE, name)});
// Make and export all actions
export const actions = R.mergeAll([
    makeAsyncActions('FETCH'),
    makeAsyncActions('UPDATE'),
    makeAsyncActions('REMOVE'),
    makeAction('SELECT_MARKER'),
    makeAction('HOVER_MARKER')
]);
// Define Action Creators
export const actionCreators = R.mergeAll([
    makeAsyncActionCreators('FETCH', fetchMarkersIO),
    makeAsyncActionCreators('UPDATE', persistMarkers),
    makeAsyncActionCreators('REMOVE', removeMarkersIO),
    // TODO not wired up
    {
        selectMarker: info => ({type: actions.SELECT_MARKER, info}),
        hoverMarker: info => ({type: actions.HOVER_MARKER, info})
    }
]);
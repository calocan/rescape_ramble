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

const {SCOPE} = require('./geojsons');
module.exports.SCOPE = SCOPE;
const R = require('ramda');
const {actionId, actionPath, asyncActions, asyncActionCreators} = require('store/reducers/actionHelpers');
// const {persistMarkers, fetchMarkers as fetchMarkersIO, removeMarkers as removeMarkersIO} = require('store/async/markerIO')
const ACTION_KEY = module.exports.ACTION_KEY = 'markers';
module.exports.ACTION_PATH = actionPath(SCOPE, ACTION_KEY);
const makeAsyncActionCreators = asyncActionCreators(SCOPE, ACTION_KEY);
const makeAsyncActions = asyncActions(SCOPE, ACTION_KEY);
const makeAction = name => ({name: actionId(SCOPE, ACTION_KEY, name)});
// Make and export all actions
const actions = module.exports.actions = R.mergeAll([
    makeAsyncActions('FETCH'),
    makeAsyncActions('UPDATE'),
    makeAsyncActions('REMOVE'),
    makeAction('SELECT_MARKER'),
    makeAction('HOVER_MARKER')
]);

// Define Action Creators
module.exports.actionCreators = R.mergeAll([
    makeAsyncActionCreators('FETCH'),
    makeAsyncActionCreators('UPDATE'),
    makeAsyncActionCreators('REMOVE'),
    // TODO not wired up
    {
        selectMarker: info => ({type: actions.SELECT_MARKER, info}),
        hoverMarker: info => ({type: actions.HOVER_MARKER, info})
    }
]);

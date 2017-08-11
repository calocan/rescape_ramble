/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Defines the all actionTypes of the application used manipulate the DOM.
 */

/*
 * Action types. See action definition for explanation
 * TODO nothing but setState is used below yet. The async stuff in the future
 * should be used in conjunction with PouchDb, cycle, etc
 */

// sets the full state to a stored value (e.g. from a cookie)
// This action is delegated to other reducers
const SET_STATE = module.exports.SET_STATE = 'SET_STATE';
const FETCH_FULL_STATE_REQUEST = module.exports.FETCH_FULL_STATE_REQUEST = 'FETCH_FULL_STATE_REQUEST';
const FETCH_FULL_STATE_SUCCESS = module.exports.FETCH_FULL_STATE_SUCCESS = 'FETCH_FULL_STATE_SUCCESS';
const FETCH_FULL_STATE_FAILURE = module.exports.FETCH_FULL_STATE_FAILURE = 'FETCH_FULL_STATE_FAILURE';

/**
 * Sets the full state to a stored value (e.g. from a cookie or cloud)
 * This action is delegated to other reducers
 * @param {Object} state The state
 * @return {Object} the action
 */
const setState = module.exports.setState = function setState(state = null) {
    return {type: SET_STATE, state: state};
};

/**
 * Action to request the full state
 * @return {Object} The action
 */
function fetchFullStateRequest() {
    return {
        type: FETCH_FULL_STATE_REQUEST
    };
}

/** 
 * Action to process the successful response
 * @param {Object} body The response body
 * @return {Object} The action
 */
function fetchFullStateSuccess(body) {
    return {
        type: FETCH_FULL_STATE_SUCCESS,
        body
    };
}

/**
 * Action to process the failure response
 * @param {Error} ex The exception
 * @return {Object} The action
 */
function fetchFullStateFailure(ex) {
    return {
        type: FETCH_FULL_STATE_FAILURE,
        ex
    };
}

/**
 * TODO replace wiht cycle call
 * @param {String} host The host domain
 * @return {Function} Dispatch
 */
const fetchFullState = module.exports.fetchFullState = function fetchFullState(host) {
    const url = `${host}/settings`;
    return dispatch => {
        dispatch(fetchFullStateRequest());
        // TODO fetch is no longer around
        // /return actionFetch(dispatch, fetch(url), fetchFullStateSuccess, fetchFullStateFailure)
    };
};


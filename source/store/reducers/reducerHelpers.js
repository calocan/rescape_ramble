/**
 * Created by Andy Likuski on 2017.06.19
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import R from 'ramda'
import {capitalize, mapKeys} from 'helpers/functions'
import Task from 'data.task'

/***
 * Create a standard action value. Curryable
 * @param {String} scope The reducer scope
 * @param {String} action The name of the action
 * @returns {String} /scope/ACTION/
 * actionId:: String -> String -> String
*/
export const actionId = R.curry((scope, action) => `/${scope}/${R.toUpper(action)}`);

const PHASES = ['DATA', 'SUCCESS', 'FAILURE'];

/**
 * For internal use to make consistent action keys in the form CRUD_ACTION_PHASE (e.g. FETCH_USER_DATA)
 */
const actionKeys = R.curry((action, crud, phase) =>`${crud}_${R.toUpper(action)}_${phase}`);
/**
 * For internal use to make consistent action values in the form scope/action/crud_phase
 */
const actionValues = R.curry((scope, action, crud, phase) =>`${scope}/${action}/${crud}_${phase}`);

/***
 * Async operations have three standard actionTypes for each crud type. Curryable.
 * Use this when you need generic action keys. Probably just for testing
 * @param {String} scope The scope of the reducer
 * @param {String} action The subject of the async operation, such as a User
 * @param {String} crud Default 'FETCH'. Or can be 'UPDATE', 'REMOVE' or anything else
 * @returns {Object} where keys are (DATA|SUCCESS|FAILURE) and value is scope/ACTION/crud_(DATA|SUCCESS|FAILURE)
 * e.g. {DATA: person/user/FETCH_DATA, SUCCESS: person/user/FETCH_SUCCESS, ERROR: person/user/FETCH_ERROR}
 */
export const asyncActionsGenericKeys = R.curry((scope, action, crud = 'FETCH') => {
    const actionValueMaker = actionValues(scope, action, crud);
    return R.compose(
        R.fromPairs,
        R.map(phase => R.pair(R.toUpper(phase), actionValueMaker(phase))),
    )(PHASES);
});

/***
 * Async operations have three standard actionTypes for each crud type. Curryable.
 * @param {String} scope The scope of the reducer
 * @param {String} action The subject of the async operation, such as a User
 * @param {String} crud Any Crud type label such as 'FETCH', 'UPDATE', 'REMOVE' or anything else
 * @returns {Object} where keys are CRUD_ACTION_(DATA|SUCCESS|FAILURE) and value is scope/ACTION/crud_(DATA|SUCCESS|FAILURE)
 * e.g. {FETCH_USER_DATA: person/user/FETCH_DATA, FETCH_USER_SUCCESS: person/user/FETCH_SUCCESS, FETCH_USER_ERROR: person/user/FETCH_ERROR}
 */
export const asyncActions = R.curry((scope, action, crud) => {
    const keyMaker = actionKeys(action, crud);
    return mapKeys(phase => keyMaker(phase), asyncActionsGenericKeys(scope, action, crud));
});

/***
 * Returns standard async action handler functions, one to initiate an async call,
 * one to crud the data, one to handle success, one to handle failure 
 * @param {String} scope The scope of the reducer
 * @param {String} action The subject of the async operation, such as a User
 * @param {String} crud Default 'FETCH'. Or can be 'UPDATE', 'REMOVE' or anything else
 * @param {Function} asyncFunc The asyncFunc to call. Must return a Task
 * @returns {Object} {
 *  CrudAction: dispatch -> func The main action that must be called with a dispatch and returns a handler
 *  function that calls the asyncFun
 *  CrudActionData: trivial action handler indicating crud call
 *  CrudActionSuccess: trivial action handler indicating crud success, returns object with response body in 'body'
 *  CrudActionFailure: trivial action handler indicating crud failure, returns object with exception in 'error'
 * }
 */
export const asyncActionCreators = R.curry((scope, action, crud, asyncFunc) => {
    const valueMaker = actionValues(scope, action, crud);
    // Creates action values (e.g. FETCH_USER_DATA)
    const {DATA, SUCCESS, FAILURE} = R.compose(
        R.fromPairs,
        R.map(phase => R.pair(phase, valueMaker(phase))),
    )(PHASES);
    const crudAction = phase => `${R.toLower(crud)}${capitalize(action)}${capitalize(phase)}`;
    const handlers = {
        [crudAction('data')]: () => ({type: DATA}),
        [crudAction('success')]: (body) => ({type: SUCCESS, body}),
        [crudAction('failure')]: (error) => ({type: FAILURE, error}),
    };
    return R.merge(handlers, {
        [crudAction('')]: function() {
            const args = arguments;
            return dispatch => {
                // Call the _data action
                dispatch(handlers[crudAction('data')]());
                // Call the asyncFunc with whatever args are passed to the actionCreator
                return asyncFunc(...args).chain(response =>
                    // Call the _success action with the response
                    // We can't call the _failure function, that must be wired up by the caller who forks
                    // this Task
                    Task.of(dispatch(handlers[crudAction('success')](response)))
                )
            }
        }
    });
});

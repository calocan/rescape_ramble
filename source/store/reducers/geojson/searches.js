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

import {searchLocation as searchLocationIO} from 'store/async/searchIO'
import {asyncActions, asyncActionCreators} from 'store/reducers/reducerHelpers'

const scope = 'searches';
const action = 'location';
const makeAsyncActionHandlers = asyncActionCreators(scope, action);
export const actions = asyncActions(scope, action, 'SEARCH');
export const actionCreators = makeAsyncActionHandlers('SEARCH', searchLocationIO);

/***
 * Reduces a gelocation search. This currently doesn't store anything in the state,
 * the Component calling the action is using the response.
 * TODO Store the search result in the state. Components should never access async results directly
 * @param state
 * @param action
 * @returns {{}}
 */
export default (state = {}, action = {}) => {
    switch (action.type) {
        default:
            return state;
    }
};

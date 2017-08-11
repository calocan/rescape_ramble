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

const {asyncActionCreators, asyncActions, asyncActionsGenericKeys} = require('./actionHelpers');
const Task = require('data.task');
const {expectTask} = require('helpers/jestHelpers');

describe('actionHelpers', () => {
    test('asyncActionsGenericKeys', () => {
        expect(asyncActionsGenericKeys('person', 'user', 'FETCH')).toMatchSnapshot();
    });
    test('asyncActions', () => {
        expect(asyncActions('person', 'user', 'FETCH')).toMatchSnapshot();
    });
    test('asyncActionCreators', () => {
        const actionCreators = asyncActionCreators(
            'person', 'user', 'FETCH'
        );
        expect(actionCreators.fetchUserData()).toEqual({type: 'person/user/FETCH_DATA'});
        expect(actionCreators.fetchUserSuccess('floopy')).toEqual({type: 'person/user/FETCH_SUCCESS', body: 'floopy'});
        expect(actionCreators.fetchUserFailure(new Error('flop'))).toEqual({type: 'person/user/FETCH_FAILURE', error: new Error('flop')});
    });
});

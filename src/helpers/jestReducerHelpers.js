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

const {asyncActionsGenericKeys} = require('redux/actionHelpers');
const R = require('ramda');

/**
 * Returns the expected sequence of successful actionTypes
 * {String} scope See asyncActionsGenericKeys
 * {String} action See asyncActionsGenericKeys
 * {String} crud See asyncActionsGenericKeys
 * {Object} expectedBody The expected body value in the success action
 */
module.exports.expectedSuccessfulAsyncActions = R.curry((scope, action, crud, expectedBody) => {
    const {DATA, SUCCESS} = asyncActionsGenericKeys(scope, action, crud);
    return [
        {type: DATA},
        {type: SUCCESS, body: expectedBody}
    ];
});

/**
 * Returns the expected sequence of failed actionTypes
 * {String} scope See asyncActionsGenericKeys
 * {String} action See asyncActionsGenericKeys
 * {String} crud See asyncActionsGenericKeys
 * {Object} expectedError The expected error value in the failure action
 */
module.exports.expectedFailedAsyncActions = R.curry((scope, action, crud, expectedError) => {
    const {DATA, FAILURE} = asyncActionsGenericKeys(scope, action, crud);
    return [
        {type: DATA},
        {type: FAILURE, error: expectedError}
    ];
});

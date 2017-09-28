/**
 * Created by Andy Likuski on 2017.02.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const thunk = require('redux-thunk');
const {mapStateToProps} = require('./MapboxContainer');
const configureStore = require('redux-mock-store');

const testConfig = require('data/test/config').default;
const initialState = require('data/initialState').default;
const {reqPath} = require('rescape-ramda').throwing;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('SankeyContainer', () => {
    test('mapStateToProps flattens viewport props', () => {
        const store = mockStore(initialState(testConfig));
        const state = store.getState();

        const ownProps = {
            region: reqPath(['regions', reqPath(['regions', 'currentKey'], state)], state),
            style: {
                width: 500,
                height: 500
            }
        };

        expect(mapStateToProps(store.getState(), ownProps)).toMatchSnapshot();
    });
});

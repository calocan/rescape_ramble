/**
 * Created by Andy Likuski on 2017.06.22
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const makeStore = require('redux/store').default;
const R = require('ramda');
const createInitialState = require('data/initialState').default;
const {sampleConfig} = require('data/samples/sampleConfig');
const {setState} = require('redux/fullStateReducer');

describe('store', () => {
    test('makeStore', () => {
        const initialState = {settings: {}};
        const store = makeStore(initialState);
        // Check for our expected state keys
        expect(R.map(v => ({}), store.getState())).toEqual(
            { browser: {}, regions: {}, routing: {}, settings: {} }
        );
    });

    test('setState', () => {
        const initialState = createInitialState(sampleConfig);
        const store = makeStore();
        store.dispatch(setState(initialState));
        // Check for our expected state keys
        expect(R.map(v => ({}), store.getState())).toEqual(
            { browser: {}, regions: {}, routing: {}, settings: {} }
        );
    });
});

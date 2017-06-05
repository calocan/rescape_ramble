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

/***
 * Configures and returns the Store with the root reducer and middleware
 */

// Do this once before any other code in your app (http://redux.js.org/docs/advanced/AsyncActions.html)
import 'babel-polyfill'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './store/reducers/reducer'

const middlewares = [
    thunk
];

if (process.env.NODE_ENV === `development`) {
    const {createLogger} = require(`redux-logger`);
    const logger = createLogger();
    middlewares.push(logger);
}

// Create the store applying our reducer and the thunk and logger middleware
export default function makeStore(initialState = {}) {
    return createStore(
        reducer,
        initialState,
        compose(
            applyMiddleware(
                ...middlewares
            ),
            // Use the Chrome devToolsExtension
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    )
}

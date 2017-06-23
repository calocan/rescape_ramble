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

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Current from 'views/current/CurrentContainer'
import Application from 'views/application/ApplicationContainer'

import {Provider} from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import {setState} from './store/reducers/fullStates'
import initialState from './store/data/initialState'
import makeStore from './store'
import currentConfig from './store/data/current/config'
import calculateResponsiveState from 'redux-responsive'
const store = makeStore();
// dispatch every time the window size changes
window.addEventListener('resize', () => store.dispatch(calculateResponsiveState(window)));
store.dispatch(setState(initialState(currentConfig)));

/***
 * App is the common component for all of our routes
 */
const routes = (
    <Router>
        <Route path="/*" component={Current} />
    </Router>
);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>{routes}</Router>
    </Provider>,
    document.getElementById('root')
);


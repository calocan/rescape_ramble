/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const React = require('react');
const ReactDOM = require('react-dom');
const Current = require('components/current/CurrentContainer').default;

const {Provider} = require('react-redux');
const {BrowserRouter, Switch, Route} = require('react-router-dom');

const {setState} = require('redux/fullStateReducer');
const initialState = require('data/initialState').default;
const makeStore = require('redux/store').default;
const {currentConfigResolver} = require('data/current/currentConfig');
const currentConfig = currentConfigResolver();
const calculateResponsiveState = require('redux-responsive');
const store = makeStore();
// dispatch every time the window size changes
window.addEventListener('resize', () => store.dispatch(calculateResponsiveState(window)));
store.dispatch(setState(initialState(currentConfig)));
const e = React.createElement;

ReactDOM.render(
  e(Provider, {store},
    e(BrowserRouter, {},
      e(Switch, {},
        e(Route, {path: '/*', component: Current})
      )
    )
  ),
  document.getElementById('root')
);


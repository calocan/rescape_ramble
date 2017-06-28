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
/***
 * Configures and returns the Store with the root reducer and middleware
 */
// Do this once before any other code in your app (http://redux.js.org/docs/advanced/AsyncActions.html)
import 'babel-polyfill';
import thunk from 'redux-thunk';
import {applyMiddleware, compose, createStore} from 'redux';
import {createCycleMiddleware} from 'redux-cycles';
import reducer from './store/reducers/reducer';
import {persistentStore} from 'redux-pouchdb-plus';
import {responsiveStoreEnhancer} from 'redux-responsive'
import PouchDB from 'pouchdb';
import R from 'ramda';
import {startSync} from "./store/async/pouchDbIO";
import {sources} from 'store/async/cycle';
import {run} from '@cycle/run'

// Use this synced db to store the state of the app
// There might be no reason to sync the state to a remote db
const dbName = 'default'
const db = new PouchDB(dbName);
startSync(db, `http://localhost:5984/${dbName}`);

const environmentMiddlewares = R.ifElse(
    R.equals('development'),
    // Development-only middlewares
    () => {
        const {createLogger} = require(`redux-logger`);
        return [
            createLogger()
        ];
    },
    // Production-only middlewares
    () => []
)(process.env.NODE_ENV);

const cycleMiddleware = createCycleMiddleware();
const { makeActionDriver, makeStateDriver } = cycleMiddleware;

// Use thunk and the persistentStore, the latter applies couchDB persistence to the store
const applyMiddlewares = applyMiddleware(
    thunk,
    cycleMiddleware,
    ...environmentMiddlewares
);

const createStoreWithMiddleware = compose(
    responsiveStoreEnhancer,
    applyMiddlewares,
    // Use the Chrome devToolsExtension
    typeof (window) !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f,
    persistentStore({db})
)(createStore);

run(sources, {
    ACTION: makeActionDriver(),
    STATE: makeStateDriver(),
})

export default (initialState = {}) => createStoreWithMiddleware(reducer, initialState);
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
/**
 * Configures and returns the Store with the root reducer and middleware
 */
// Do this once before any other code in your app (http://redux.js.org/docs/advanced/AsyncActions.html)
const thunk = require('redux-thunk').default;
const {applyMiddleware, compose, createStore} = require('redux');
const {createCycleMiddleware} = require('redux-cycles');
const reducer = require('redux/reducer').default;
// const {persistentStore} = require('redux-pouchdb-plus');
const {responsiveStoreEnhancer} = require('redux-responsive');
// const PouchDB = require('pouchdb').default;
const R = require('ramda');
// const {startSync} = require('unused/pouchDbIO');
const {main} = require('redux/cycle');
const {run} = require('@cycle/run');
// const {makePouchDBDriver} = require('cycle-pouchdb-most-driver');

// Use this synced db to store the state of the app
// There might be no reason to doSync the state to a remote db
// const DB_NAME = 'default';
// const db = new PouchDB(DB_NAME);
// startSync(db, `http://localhost:5984/${DB_NAME}`);

const environmentMiddlewares = R.ifElse(
    R.equals('development'),
    // Development-only middlewares
    () => {
        const {createLogger} = require('redux-logger');
        return [
            createLogger()
        ];
    },
    // Production-only middlewares
    () => []
)(process.env.NODE_ENV);

const cycleMiddleware = createCycleMiddleware();
const { makeActionDriver, makeStateDriver } = cycleMiddleware;


const runCycle = dbName => run(main, {
    ACTION: makeActionDriver(),
    STATE: makeStateDriver()
    // POUCHDB: makePouchDBDriver(PouchDB, dbName)
});
let dispose = null;
module.exports.restartCycle = (dbName) => {
    if (dispose) {
        dispose();
    }
    dispose = runCycle(dbName);
    return dispose;
};

/**
 * Function to create a store that accepts an initial state for testing
 * @param {Object} [initialState] The optional initial state of the store
 * @returns {Object} The redux Store
 */
module.exports.default = (initialState = {}) => createStore(
    reducer,
    initialState,
    // In addition to Middleware, compose state with PouchDb, devTools, and Redux Responsive
    compose(
        responsiveStoreEnhancer,
        // Use thunk and the persistentStore, the latter applies couchDB persistence to the store
        applyMiddleware.apply(undefined, // eslint-disable-line
            R.concat([
              thunk,
              cycleMiddleware
            ],
            environmentMiddlewares)
        ),
        // Use the Chrome devToolsExtension
        typeof (window) !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f,
        // persistentStore({db})
    )
);

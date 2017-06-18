
//import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
//import Current from 'views/current/CurrentContainer'
//import Application from 'views/application/ApplicationContainer'

//import {Provider} from 'react-redux'
//import { Router, Route, browserHistory } from 'react-router'
//import { syncHistoryWithStore } from 'react-router-redux'

//import {setState} from './store/reducers/fullState'
//import initialState from './store/data/initialState'
//import makeStore from './store'
//import currentConfig from './store/data/current/config'
// Create an enhanced history that syncs navigation events with the store
//const history = syncHistoryWithStore(browserHistory, store);

//import currentConfig from './store/data/current/config'
import { createStore, applyMiddleware, compose } from 'redux'
const middlewares = [
];
const store = createStore(
    function(state = {}, action) {return state},
    {},
    compose(
        applyMiddleware(
            ...middlewares
        ),
        // Use the Chrome devToolsExtension
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
)
//const store = makeStore();
//store.dispatch(setState(initialState(currentConfig)));
// Create an enhanced history that syncs navigation events with the store
import MapGL from 'react-map-gl';

const token = process.env.MAPBOX_ACCESS_TOKEN; // eslint-disable-line

if (!token) {
  throw new Error('Please specify a valid mapbox token');
}

ReactDOM.render(
    <MapGL/>,
    document.getElementById('root')
);

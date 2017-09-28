
const React = require('react');
const ReactDOM = require('react-dom');
const MapGL = require('react-map-gl');
const Current = require('components/current/CurrentContainer').default;
const {Provider} = require('react-redux');

const {setState} = require('./store/reducers/fullState');
const initialState = require('./data/initialState').default;
const makeStore = require('./redux/store').default;
const currentConfig = require('./data/current/currentConfig').default;

// const currentConfig = require('./data/current/config').default;
const { createStore, applyMiddleware, compose } = require('redux');
const e = React.createElement;
const store = makeStore();
store.dispatch(setState(initialState(currentConfig)));

// Create an enhanced history that syncs navigation events with the store

const token = process.env.MAPBOX_ACCESS_TOKEN; // eslint-disable-line

if (!token) {
  throw new Error('Please specify a valid mapbox token');
}

ReactDOM.render(
    e(Provider, {},
        e(Current, {},
            e(MapGL, {})
        )
    ),
    document.getElementById('root')
);

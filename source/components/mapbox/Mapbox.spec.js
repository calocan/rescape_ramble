import MapGL from 'react-map-gl'
import React from 'react';
import ReactDOM from 'react-dom';
import document from 'global/document';
import test from 'tape-catch';
import { shallow } from 'enzyme';
import config from 'config.json';

// Hoping to use maxBounds like in the react-mapbox-gl lib
const { mapboxApiAccessToken, style, maxBounds, center, zoom, pitch, bearing } = config;

const defaultProps = {
    width: 500,
    height: 500,
    longitude: center.longitude,
    latitude: center.latitude,
    zoom: zoom,
    mapboxApiAccessToken
};

test('MapGL can mount', () => {
    const reactContainer = document.createElement('div');
    document.body.appendChild(reactContainer);
    const wrapper = shallow(<MapGL {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
});

test('MapGL call onLoad when provided', t => {
    const reactContainer = document.createElement('div');
    document.body.appendChild(reactContainer);

    function onLoad(...args) {
        t.equal(args.length, 0, 'onLoad does not expose the map object.');
        t.end();
    }

    const props = {onLoad, ...defaultProps};
    ReactDOM.render(<MapGL {...props} />, reactContainer);

    if (!MapGL.supported()) {
        t.end();
    }

});

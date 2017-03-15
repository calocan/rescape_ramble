import MapGL from 'react-map-gl'
import React from 'react';
import {shallow, mount} from 'enzyme';
import config from 'config.json';

// Hoping to use maxBounds like in the react-mapbox-gl lib
const {mapboxApiAccessToken, style, maxBounds, center, zoom, pitch, bearing} = config;

const defaultProps = {
    width: 500,
    height: 500,
    longitude: center.longitude,
    latitude: center.latitude,
    zoom: zoom,
    mapboxApiAccessToken
};

it('MapGL can mount', () => {
    const wrapper = shallow(<MapGL {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
});

/*
TODO I don't know how to test this
 */
/*
it('MapGL call onLoad when provided', () => {
    const onLoad = jest.fn();

    const props = {onLoad, ...defaultProps};
    mount(<MapGL {...props} />);
    expect(onLoad).toBeCalledWith();
});
*/

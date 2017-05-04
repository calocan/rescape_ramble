import MapGL from 'react-map-gl'
import createMapbox from './Mapbox'
import React from 'react';
import {shallow, mount} from 'enzyme';
import R from 'ramda';
import {getPath, toJS} from 'helpers/functions'
import {mapStateToProps} from './MapboxContainer'

import config from 'store/data/test/config'
import initialState from "store/data/initialState";
jest.unmock('query-overpass')

const state = initialState(config);
const currentKey = getPath(['regions', 'currentKey'], state);
const gtfs = require('queryOverpassResponse').LA_SAMPLE;
//const {stops, lines, icons} = x(['way', 'node'], gtfs)
const props = mapStateToProps(state, {
    region: getPath(['regions', currentKey], state),
    stops: null,
    lines: null,
    icons: null,
    style: {
        width: 500,
        height: 500
    }
});

it('MapGL can mount', () => {
    const wrapper = shallow(<MapGL {...props} />);
    expect(wrapper).toMatchSnapshot();
});
it('MapBox loads data', () => {
    const Mapbox = createMapbox(React);
    const {stops, lines, icons} = this.props.gtfs
    const wrapper = shallow(<Mapbox {...props} />);
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

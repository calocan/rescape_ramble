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
const reduceFeaturesBy = R.reduceBy((acc, feature) => acc.concat(feature), []);
const regex = /(.+)\/\d+/;
// Get the feature by type based on its id
const featureByType = reduceFeaturesBy(feature => R.match(regex, feature.id)[1]);
// Create valid GTFS json to give the map by replacing the features of the original by filtered values for each type
const gtfsByType = R.map(
    featureOfType => R.set(R.lensProp('features'), featureOfType, gtfs),
    featureByType(gtfs.features));

const props = mapStateToProps(state, {
    region: getPath(['regions', currentKey], state),
    stops: gtfsByType.node,
    lines: gtfsByType.way,
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

import React from 'react';
import {shallow} from 'enzyme';
import {getPath} from 'helpers/functions';
import {mapStateToProps} from './MarkerListContainer';
import {geojsonByType} from 'helpers/geojsonHelpers';
import Mapbox from 'components/mapbox/Mapbox'
import MapGL from 'react-map-gl'

import config from 'store/data/test/config';
import initialState from 'store/data/initialState';
import R from 'ramda';
import MarkerList from './MarkerList'
jest.mock('query-overpass')
const state = initialState(config);
const currentKey = getPath(['regions', 'currentKey'], state);
const geojson = require('queryOverpassResponse').LA_SAMPLE;

const props = mapStateToProps(state, {
    region: R.set(
        R.lensProp('geojson'),
        geojsonByType(geojson),
        getPath(['regions', currentKey], state)
    )
});

describe('MarkerList', () => {
    it('MarkerList can mount', () => {
        const wrapper = shallow(<MarkerList
            { ...props }
        />);
        expect(wrapper).toMatchSnapshot();
    });
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

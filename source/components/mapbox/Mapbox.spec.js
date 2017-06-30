import MapGL from 'react-map-gl';
import Mapbox from './Mapbox';
import React from 'react';
import {shallow} from 'enzyme';
import {getRequiredPath} from 'helpers/functions';
import {mapStateToProps, mapDispatchToProps} from './MapboxContainer';
import {geojsonByType} from 'helpers/geojsonHelpers';

import config from 'store/data/test/config';
import initialState from 'store/data/initialState';
import R from 'ramda';

jest.mock('query-overpass')
const state = initialState(config);
const currentKey = getRequiredPath(['regions', 'currentKey'], state);
const geojson = require('queryOverpassResponse').LA_SAMPLE;

const props = R.merge(
    mapStateToProps(state, {
        // Put geojson in the Region since that is normally loaded asyncronously
        region: R.set(
            R.lensProp('geojson'),
            geojsonByType(geojson),
            getRequiredPath(['regions', currentKey], state)
        ),
        style: {
            width: 500,
            height: 500
        }
    }),
    mapDispatchToProps(state));

describe('Mapbox', () => {
    it('MapGL can mount', () => {
        const wrapper = shallow(<MapGL
            {...props.viewport}
            showZoomControls={ true }
            perspectiveEnabled={ true }
            preventStyleDiffing={ false }
        />);
        expect(wrapper).toMatchSnapshot();
    });
    it('MapBox loads data', () => {
        const wrapper = shallow(<Mapbox {...props} />);
        expect(wrapper).toMatchSnapshot();
    })
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

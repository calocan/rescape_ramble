import MapGL from 'react-map-gl'
import React from 'react';
import {shallow, mount} from 'enzyme';
import R from 'ramda';
import {getPath, toJS} from 'helpers/functions'

import config from 'store/data/test/config'
import initialState from "store/data/initialState";

const state = initialState(config);
const props = R.merge(
    {
        mapboxApiAccessToken: config.settings.mapboxApiAccessToken,
        width: 500,
        height: 500,
    },
    toJS(getPath(['regions', 'current', 'mapbox', 'viewport'], state))
);

it('MapGL can mount', () => {
    const wrapper = shallow(<MapGL {...props} />);
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

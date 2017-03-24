import MapGL from 'react-map-gl'
import React from 'react';
import {shallow, mount} from 'enzyme';

import config from 'store/data/california/config'
const props = Object.assign(
    {
        mapboxApiAccessToken: config.settings.mapboxApiAccessToken,
        width: 500,
        height: 500,
    },
    config.mapbox.viewport
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

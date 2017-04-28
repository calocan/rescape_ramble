import React from 'react';
import {shallow} from 'enzyme'
import createRegion from './Region';
import testConfig from 'store/data/test/config'
import initialState from 'store/data/initialState'

const Region = createRegion(React);

test('Region', () => {
    const state = initialState(testConfig);

    const props = {
        region: state.regions.current,
        width: 500,
        height: 500
    };

    it('Region can mount', () => {
        const wrapper = shallow(<Region {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

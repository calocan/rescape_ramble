import React from 'react';
import {shallow} from 'enzyme'
import createRegion from './Region';
import testConfig from 'store/data/test/config'
import initialState from 'store/data/initialState'
import R from 'ramda'

const Region = createRegion(React);

test('Region', () => {
    const state = initialState(testConfig);

    const props = {
        region: R.prop(state.regions.currentKey, state.regions),
        width: 500,
        height: 500
    };

    it('Region can mount', () => {
        const wrapper = shallow(<Region {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

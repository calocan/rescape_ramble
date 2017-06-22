import React from 'react';
import {shallow} from 'enzyme'

import Current from './Current';
import testConfig from 'store/data/test/config'
import initialState from 'store/data/initialState'
import R from 'ramda'

describe('The current application', () => {

    const state = initialState(testConfig);

    const props = {
        region: R.prop(state.regions.currentKey, state.regions),
        style: {
            width: 500,
            height: 500
        }
    };

    test('Current can mount', () => {
        const wrapper = shallow(<Current {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

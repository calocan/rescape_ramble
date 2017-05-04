import React from 'react';
import {shallow} from 'enzyme'

import createCurrent from './Current';
import testConfig from 'store/data/test/config'
import initialState from 'store/data/initialState'
import R from 'ramda'

const Current = createCurrent(React);

describe('The current application', () => {

    const state = initialState(testConfig);

    const props = {
        region: R.prop(state.regions.currentKey, state.regions),
        width: 500,
        height: 500
    };

    it('Current can mount', () => {
        const wrapper = shallow(<Current {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

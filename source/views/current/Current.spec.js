import React from 'react';
import {shallow} from 'enzyme'

import createCurrent from './Current';
import testConfig from 'store/data/test/config'
import initialState from 'store/data/initialState'

const Current = createCurrent(React);

describe('The current application', () => {

    const state = initialState(testConfig);

    const props = {
        width: 500,
        height: 500,
    };

    it('Current can mount', () => {
        const wrapper = shallow(<Current {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

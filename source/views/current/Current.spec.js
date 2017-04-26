import React from 'react';
import {shallow} from 'enzyme'

import createCurrent from './Current';

const Current = createCurrent(React);

describe('The current application', () => {
    it('Current can mount', () => {
        const wrapper = shallow(<Current {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

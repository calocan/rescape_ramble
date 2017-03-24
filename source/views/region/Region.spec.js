import React from 'react';
import {shallow} from 'enzyme'

import createRegion from './Region';

const Region = createRegion(React);

test('Region', () => {
    const titleText = 'Hello!';
    const props = {
        title: titleText,
        titleClass: 'title'
    };
    const Component = shallow(<Region {...props} />)
    expect(Component).toMatchSnapshot();
});

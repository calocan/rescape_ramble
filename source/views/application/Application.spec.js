import React from 'react';
import {shallow} from 'enzyme'

import createApplication from './Application';

const Application = createApplication(React);

test('Application', () => {
    const titleText = 'Hello!';
    const props = {
        title: titleText,
        titleClass: 'title'
    };
    const Component = shallow(<Application {...props} />);
    expect(Component).toMatchSnapshot();
});

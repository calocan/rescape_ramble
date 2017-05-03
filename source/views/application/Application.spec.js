import React from 'react';
import {shallow} from 'enzyme'

import createApplication from './Application';

const Application = createApplication(React);

describe('Application', () => {
    test('Application can mount', () => {
        const props = {};
        const Component = shallow(<Application {...props} />);
        expect(Component).toMatchSnapshot();
    })
});

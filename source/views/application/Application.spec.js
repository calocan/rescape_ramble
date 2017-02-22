import React from 'react';
import test from 'tape-catch';
import {shallow} from 'enzyme'

import createApplication from './Application';

const Application = createApplication(React);

test('Application', t => {
    const titleText = 'Hello!';
    const props = {
        title: titleText,
        titleClass: 'title'
    };
    const re = new RegExp(titleText, 'g');

    const choice = 'Choice 1'
    const Component = shallow(<Application {...props} />)
    t.ok(Component.length)
    t.equals(Component.find('label').text(), choice, `Expect label to contain ${choice}`)
    Component.find('input').simulate('click');
    // i.e. change the component in some way from clicking and check for the change
    t.equals(Component.find('.clicks-1').length, 1, 'Should have been clicked')
    t.end();
});
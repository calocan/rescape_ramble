const React = require('react');
const {shallow} = require('enzyme');

const Current = require('./Current').default;
const testConfig = require('data/test/config').default;
const initialState = require('data/initialState').default;
const R = require('ramda');
const e = React.createElement;

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
        const wrapper = shallow(
            e(Current, props)
        );
        expect(wrapper).toMatchSnapshot();
    });
});

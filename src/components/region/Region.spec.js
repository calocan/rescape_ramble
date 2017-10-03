const React = require('react');
const {shallow} = require('enzyme');

const testConfig = require('data/samples/config').default;
const initialState = require('data/initialState').default;
const R = require('ramda');
const e = React.createElement;
const Region = require('./Region').default;

describe('Region', () => {
    const state = initialState(testConfig);

    const props = {
        region: R.prop(state.regions.currentKey, state.regions),
        width: 500,
        height: 500
    };

    test('Region can mount', () => {
        const wrapper = shallow(
            e(Region, props)
        );
        expect(wrapper).toMatchSnapshot();
    });
});

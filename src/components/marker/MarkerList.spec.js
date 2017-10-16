const React = require('react');
const {shallow} = require('enzyme');
const {reqPath} = require('rescape-ramda').throwing;
const {mapStateToProps} = require('./MarkerListContainer');
const {geojsonByType} = require('helpers/geojsonHelpers');

const {sampleConfig} = require('data/samples/sampleConfig');
const initialState = require('data/initialState').default;
const R = require('ramda');
const MarkerList = require('./MarkerList').default;
jest.mock('query-overpass');
const state = initialState(config);
const currentKey = reqPath(['regions', 'currentKey'], state);
const geojson = require('queryOverpassResponse').LA_SAMPLE;
const e = React.createElement;

const props = mapStateToProps(state, {
    region: R.set(
        R.lensProp('geojson'),
        geojsonByType(geojson),
        reqPath(['regions', currentKey], state)
    )
});

describe('MarkerList', () => {
    it('MarkerList can mount', () => {
        const wrapper = shallow(e(MarkerList, props));
        expect(wrapper).toMatchSnapshot();
    });
});

/*
TODO I don't know how to test this
 */
/*
it('MapGL call onLoad when provided', () => {
    const onLoad = jest.fn();

    const props = {onLoad, ...defaultProps};
    mount(<MapGL {...props} />);
    expect(onLoad).toBeCalledWith();
});
*/

const MapGL = require('react-map-gl');
const Mapbox = require('./Mapbox').default;
const React = require('react');
const {shallow} = require('enzyme');
const {reqPath} = require('rescape-ramda').throwing;
const {mapStateToProps, mapDispatchToProps} = require('./MapboxContainer');
const {geojsonByType} = require('helpers/geojsonHelpers');
const e = React.createElement;

const config = require('data/samples/config').default;
const initialState = require('data/initialState').default;
const R = require('ramda');

jest.mock('query-overpass');
const state = initialState(config);
const currentKey = reqPath(['regions', 'currentKey'], state);
const geojson = require('queryOverpassResponse').LA_SAMPLE;

const props = R.merge(
    mapStateToProps(state, {
        // Put geojson in the Region since that is normally loaded asyncronously
        region: R.set(
            R.lensProp('geojson'),
            geojsonByType(geojson),
            reqPath(['regions', currentKey], state)
        ),
        style: {
            width: 500,
            height: 500
        }
    }),
    mapDispatchToProps(state));

describe('Mapbox', () => {
    it('MapGL can mount', () => {
        const wrapper = shallow(
            e(MapGL, R.merge(props.viewport, {
                showZoomControls: true,
                perspectiveEnabled: true,
                preventStyleDiffing: false
            }))
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('MapBox loads data', () => {
        const wrapper = shallow(
            e(Mapbox, props)
        );
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

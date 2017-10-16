const mapGL = require('react-map-gl');
const mapbox = require('./Mapbox').default;
const {shallow} = require('enzyme');
const {reqPath} = require('rescape-ramda').throwing;
const {mapStateToProps, mapDispatchToProps} = require('./MapboxContainer');
const {geojsonByType} = require('helpers/geojsonHelpers');
const {sampleConfig} = require('data/samples/sampleConfig');
const initialState = require('data/initialState').default;
const R = require('ramda');

jest.mock('query-overpass');
const state = initialState(sampleConfig);
const geojson = require('async/queryOverpass.sample').LA_SAMPLE;
const regionKey = 'oakland';
const {eMap} = require('helpers/componentHelpers');
const [MapGL, Mapbox] =
  eMap([mapGL, mapbox]);

const props = R.merge(
  mapStateToProps(state, {
    // Put geojson in the Region since that is normally loaded asyncronously
    region: R.set(
      R.lensProp('geojson'),
      geojsonByType(geojson),
      reqPath(['regions', regionKey], state)
    ),
    style: {
      width: 500,
      height: 500
    }
  }),
  mapDispatchToProps(state));

describe('Mapbox', () => {
  test('MapGL can mount', () => {
    const wrapper = shallow(
      MapGL(R.merge(props.viewport, {
        showZoomControls: true,
        perspectiveEnabled: true,
        preventStyleDiffing: false
      }))
    );
    expect(wrapper).toMatchSnapshot();
  });
  test('Mapbox loads data', () => {
    const wrapper = shallow(
      Mapbox(props)
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

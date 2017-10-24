const mapGL = require('react-map-gl');
const mapbox = require('./Mapbox').default;
const {shallow} = require('enzyme');
const {mapStateToProps, mapDispatchToProps} = require('./MapboxContainer');
const R = require('ramda');
const {sampleInitialState} = require('helpers/jestHelpers');
const state = sampleInitialState();

const {eMap} = require('helpers/componentHelpers');
const [MapGL, Mapbox] =
  eMap([mapGL, mapbox]);

const props = mapStateToProps(state, {});

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


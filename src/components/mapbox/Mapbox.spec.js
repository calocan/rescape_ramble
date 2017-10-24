const mapGL = require('react-map-gl');
const mapbox = require('./Mapbox').default;
const {shallow} = require('enzyme');
const {mapStateToProps, mapDispatchToProps} = require('./MapboxContainer');
const R = require('ramda');
const {sampleInitialState} = require('helpers/jestHelpers');
const state = sampleInitialState();
const {findOne, onlyOne, reqPath} = require('rescape-ramda').throwing;

const {eMap} = require('helpers/componentHelpers');
const [MapGL, Mapbox] =
  eMap([mapGL, mapbox]);

const props = mapStateToProps(state, {});
const {mapped} = require('ramda-lens');

describe('Mapbox', () => {
  test('MapGL can mount', () => {
    const regionLens = R.lensPath(['data', 'regions'])
    const regionsMapboxVieportLens = R.compose(mapped, R.lensPath(['mapbox', 'viewport']));
    // Creates a
    const viewportsSelector = R.compose(
      R.view(regionsMapboxVieportLens),
      R.view(regionLens))

    (props);

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


const mapGL = require('react-map-gl');
const mapbox = require('./Mapbox').default;
const {shallow} = require('enzyme');
const {mapStateToProps, mapDispatchToProps} = require('./MapboxContainer');
const R = require('ramda');
const {makeSampleInitialState} = require('helpers/jestHelpers');
const state = makeSampleInitialState();

const {eMap} = require('helpers/componentHelpers');
const [MapGL, Mapbox] = eMap([mapGL, mapbox]);

describe('Mapbox', () => {
  test('MapGL can mount', () => {

    const wrapper = shallow(
      MapGL(mapStateToProps(state))
    );
    expect(wrapper).toMatchSnapshot();
  });
});


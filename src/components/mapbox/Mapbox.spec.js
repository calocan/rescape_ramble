const mapGL = require('react-map-gl').default;
const mapbox = require('./Mapbox').default;
const {shallow} = require('enzyme');
const {mapStateToProps, mapDispatchToProps} = require('./MapboxContainer');
const R = require('ramda');
const {makeSampleInitialState} = require('helpers/jestHelpers');
const state = makeSampleInitialState();
const {propsFromSampleStateAndContainer} = require('helpers/jestHelpers');

const {eMap} = require('helpers/componentHelpers');
const [MapGL, Mapbox] = eMap([mapGL, mapbox]);

describe('Mapbox', () => {
  test('Can mount', () => {

    const props = propsFromSampleStateAndContainer(
      mapStateToProps,
      mapDispatchToProps,
      {
        // style dimensions are normally from the parent
        style: {
          width: 500,
          height: 500
        }
      }
    );

    const wrapper = shallow(
      MapGL(props)
    );
    expect(wrapper).toMatchSnapshot();
  });
});


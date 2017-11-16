const mapGL = require('react-map-gl').default;
const mapbox = require('./Mapbox').default;
const {shallow} = require('enzyme');
const {testPropsMaker} = require('./MapboxContainer');
const {propsFromSampleStateAndContainer} = require('helpers/jestHelpers');

const {eMap} = require('helpers/componentHelpers');
const [MapGL, Mapbox] = eMap([mapGL, mapbox]);

describe('Mapbox', () => {
  test('Can mount', () => {
    const props = propsFromSampleStateAndContainer(testPropsMaker,
      {
        // style dimensions are normally from the parent
        style: {
          width: 500,
          height: 500
        }
      }
    );

    const wrapper = shallow(
      Mapbox(props)
    );
    expect(wrapper).toMatchSnapshot();
  });
});


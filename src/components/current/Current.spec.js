const {shallow} = require('enzyme');
const current = require('./Current').default;
const {sampleConfig} = require('data/samples/sampleConfig');
const initialState = require('data/initialState').default;
const R = require('ramda');
const {reqPath} = require('rescape-ramda').throwing;
const {eMap} = require('helpers/componentHelpers');
const {mapStateToProps} = require('./CurrentContainer');
const [Current] = eMap([current]);

describe('The current application', () => {
  const state = initialState(sampleConfig);

  const props = {
    // Style proportional to the browser size
    style: {
      width: 0.5,
      height: 0.5
    }
  };

  test('Current can mount', () => {
    const wrapper = shallow(
      Current(mapStateToProps(state, props))
    );
    expect(wrapper).toMatchSnapshot();
  });
});

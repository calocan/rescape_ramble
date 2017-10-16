const {shallow} = require('enzyme');
const current = require('./Current').default;
const {sampleConfig} = require('data/samples/sampleConfig');
const initialState = require('data/initialState').default;
const R = require('ramda');
const {reqPath} = require('rescape-ramda').throwing;
const {eMap} = require('helpers/componentHelpers');
const [Current] =
  eMap([current]);
const regionKey = 'oakland';

describe('The current application', () => {
  const state = initialState(sampleConfig);

  const props = {
    region: reqPath(['regions', regionKey], state),
    style: {
      width: 500,
      height: 500
    }
  };

  test('Current can mount', () => {
    const wrapper = shallow(
      Current(props)
    );
    expect(wrapper).toMatchSnapshot();
  });
});

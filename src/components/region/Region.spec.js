const React = require('react');
const {shallow} = require('enzyme');

const {sampleConfig} = require('data/samples/sampleConfig');
const initialState = require('data/initialState').default;
const {reqPath} = require('rescape-ramda').throwing;
const region = require('./Region').default;
const {eMap} = require('helpers/componentHelpers');
const [Region] =
  eMap([region]);
const regionKey = 'oakland';

describe('Region', () => {
  const state = initialState(sampleConfig);

  const props = {
    region: reqPath(['regions', regionKey], state),
    style: {
      width: 500,
      height: 500
    },
    settings: reqPath(['settings'], state),
    onRegionIsChanged: () => {},
    fetchMarkersData: () => {}
  };

  test('Region can mount', () => {
    const wrapper = shallow(
      Region(props)
    );
    expect(wrapper).toMatchSnapshot();
  });
});

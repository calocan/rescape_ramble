const React = require('react');
const {shallow} = require('enzyme');

const {propsFromSampleStateAndContainer} = require('helpers/jestHelpers');
const region = require('./Region').default;
const {eMap} = require('helpers/componentHelpers');
const {mapStateToProps, mapDispatchToProps} = require('./RegionContainer');
const [Region] = eMap([region]);

describe('Region', () => {
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

  test('Can mount', () => {
    const wrapper = shallow(
      Region(props)
    );
    expect(wrapper).toMatchSnapshot();
  });
});

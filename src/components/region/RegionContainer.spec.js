const {mapStateToProps} = require('./RegionContainer');
const {makeSampleInitialState} = require('helpers/jestHelpers');

describe('RegionContainer', () => {
  test('mapStateToProps', () => {
    const props = {
      style: {
        width: 500,
        height: 500
      }
    };

    expect(mapStateToProps(makeSampleInitialState(), props)).toMatchSnapshot();
  });
});

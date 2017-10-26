const {connect} = require('react-redux');
const R = require('ramda');
const Region = require('./Region').default;
const {actions} = require('redux/geojson/geojsonReducer');

const select =
const mapStateToProps = module.exports.mapStateToProps = (state, props) => {
  // props from the parent trump the overall state
  return selector(R.merge(state, props));
  return R.merge(
    props,
    {
      settings: state.settings,
      accessToken: props.region.mapbox.mapboxApiAccessToken
    }
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRegionIsChanged: (options, bounds) => {
      dispatch({
        type: actions.FETCH_TRANSIT_DATA,
        args: [options, bounds]
      });
    }
  };
};

const RegionContainer = connect(
  /**
   * The wrapped component needs access to the settings and a r
   * @param state
   * @returns {{}}
   */
  mapStateToProps, mapDispatchToProps()
)(Region);

module.exports.default = RegionContainer;


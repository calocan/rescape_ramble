const {connect} = require('react-redux');
const Region = require('./Region').default;
const {actions} = require('redux/geojson/geojsonReducer');
const {makeViewportsSelector, makeActiveUserAndRegionStateSelector, mapboxSettingsSelector, makeMergeDefaultStyleWithProps} = require('helpers/reselectHelpers');
const {createSelector} = require('reselect');
const R = require('ramda');

const mapStateToProps = module.exports.mapStateToProps = module.exports.mapStateToProps =
  createSelector(
    [
      makeActiveUserAndRegionStateSelector(),
      makeMergeDefaultStyleWithProps(),
      mapboxSettingsSelector,
    ],
    (selectedState, style, mapboxSettings) => {
      const viewport = makeViewportsSelector()(selectedState);
      return R.mergeAll([
        selectedState,
        {style},
        {
          views: {
            // Since viewport it a Functor we map it and then merge it
            // TODO find a cleaner way to represent this
            mapbox: R.map(
              viewport => R.merge(
                mapboxSettings, {viewport}
              ),
              viewport)
          }
        }
      ]);
    }
  );

const mapDispatchToProps = module.exports.mapDispatchToProps = (dispatch) => {
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
  mapStateToProps, mapDispatchToProps
)(Region);

module.exports.default = RegionContainer;


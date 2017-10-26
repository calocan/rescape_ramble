const {connect} = require('react-redux');
const Current = require('./Current').default;
const R = require('ramda');
const {createSelector} = require('reselect');
const {currentRegion} = require('helpers/stateHelpers');
const {activeUserAndRegionStateSelector, browserDimensionsSelector} = require('helpers/reselectHelpers');

/**
 * Limits the state to the active user and region
 */
const mapStateToProps = module.exports.mapStateToProps = (state, props) =>
  createSelector(
    [
      activeUserAndRegionStateSelector,
      browserDimensionsSelector
    ],
    (activeUserAndRegion, browserDimensions) => R.merge(
      activeUserAndRegionStateSelector,
      {
        // Assume no other styles at this point
        style: browserDimensions
      }
    )
  )(R.merge(state, props));

const CurrentContainer = connect(
  mapStateToProps
)(Current);

module.exports.default = CurrentContainer;

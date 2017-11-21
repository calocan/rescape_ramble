const {connect} = require('react-redux');
const Current = require('./Current').default;
const R = require('ramda');
const {createSelector} = require('reselect');
const {makeActiveUserAndRegionStateSelector, makeBrowserProportionalDimensionsSelector} = require('helpers/reselectHelpers');
const {mergeDeep} = require('rescape-ramda');

/**
 * Combined selector that:
 * Limits the state to the active user and region. This merges props with the state immediate, overriding the
 * state with anything in props. It does not pass props on to sub selectors as a separate argument
 * Limits the component dimensions to the browser. This ignores
 * @param {Object} state The redux state
 * @param {Object} [props] The optional props to override the state.
 * @returns {Object} The state and own props mapped to props for the component
 */
const mapStateToProps = module.exports.mapStateToProps = (state, props) =>
  createSelector(
    [
      (state, props) => {
        return makeActiveUserAndRegionStateSelector()(mergeDeep(state, R.defaultTo({}, props)));
      },
      makeBrowserProportionalDimensionsSelector()
    ],
    (activeUserAndRegion, dimensions) => R.merge(
      activeUserAndRegion,
      {
        // Merge the browser dimensions with the props
        // props from the parent contain style instructions
        // TODO we need to set width and height proportional to the browser dimensions, not equal to
        style: dimensions
      }
    )
  )(state, props);

const CurrentContainer = connect(
  mapStateToProps
)(Current);

module.exports.default = CurrentContainer;

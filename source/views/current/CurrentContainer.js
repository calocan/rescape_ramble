const {connect} = require('react-redux');
const Current = require('./Current.js').default;
const R = require('ramda');
const {currentRegion} = require('helpers/stateHelpers');

/**
 * The CurrentContainer and all children are scoped to a single Region
 * @param {Object} state The Store state
 * @returns {Object} the props from the state
 */
const mapStateToProps = module.exports.mapStateToProps = state => ({
    region: currentRegion(state),
    style: R.fromPairs(R.map(
        // Pass the current window width and height
        // This could be scaled here if we don't want the CurrentContainer to be the full window width/height
        dimension => R.pair(dimension, state.browser[dimension]),
        ['width', 'height']))
});

const CurrentContainer = connect(
    mapStateToProps
)(Current);

module.exports.default = CurrentContainer;

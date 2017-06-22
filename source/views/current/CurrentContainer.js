import {connect} from 'react-redux';
import Current from './Current.js';
import R from 'ramda';

/***
 * The CurrentContainer and all children are scoped to a single Region
 * @param state
 */
export const mapStateToProps = state => ({
    region: R.prop(state.regions.currentKey, state.regions),
    style: R.fromPairs(R.map(
        // Pass the current window width and height
        // This could be scaled here if we don't want the CurrentContainer to be the full window width/height
        dimension => R.pair(dimension, state.browser[dimension]),
        ['width', 'height']))
});

const CurrentContainer = connect(
    mapStateToProps
)(Current);

export default CurrentContainer;

import {connect} from 'react-redux';
import Current from './Current.js';
import R from 'ramda';

export const mapStateToProps = (state) => {
    return {
        region: R.prop(state.regions.currentKey, state.regions)
    }
}

const CurrentContainer = connect(
    /***
     * Passes the regions and current region
     * @param state
     * @param ownProps
     * @returns {{}}
     */
    mapStateToProps
)(Current);
export default CurrentContainer;

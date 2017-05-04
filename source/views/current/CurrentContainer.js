import {connect} from 'react-redux';
import createCurrent from './Current.js';
import React from 'react';
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
)(createCurrent(React));
export default CurrentContainer;

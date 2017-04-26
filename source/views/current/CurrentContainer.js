import {connect} from 'react-redux';
import createCurrent from './Current.js';
import React from 'react';
import R from 'ramda';

export const mapStateToProps = (state, ownProps) => R.pick(['regions', 'current'], state.settings);

export default connect(
    /***
     * Passes the regions and current region
     * @param state
     * @param ownProps
     * @returns {{}}
     */
    mapStateToProps
)(createCurrent(React));

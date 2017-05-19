import {connect} from 'react-redux';
import React from 'react';
import R from 'ramda';
import createRegion from './Region.js';
import * as actions from 'store/reducers/geojson';

export const mapStateToProps = (state, ownProps) => {
    return R.merge(
        ownProps,
        {
            settings: state.settings
        }
    );
}
const RegionContainer = connect(
    /***
     * The wrapped component needs access to the settings and a r
     * @param state
     * @returns {{}}
     */
    mapStateToProps, actions
)(createRegion(React));
export default  RegionContainer;

import {connect} from 'react-redux';
import React from 'react';
import R from 'ramda';
import Region from './Region.js';
import * as geojsonActions from 'store/reducers/geojson/geojson';

export const mapStateToProps = (state, ownProps) => {
    return R.merge(
        ownProps,
        {
            settings: state.settings,
            accessToken: ownProps.region.mapbox.mapboxApiAccessToken
        }
    );
}
const RegionContainer = connect(
    /***
     * The wrapped component needs access to the settings and a r
     * @param state
     * @returns {{}}
     */
    mapStateToProps, geojsonActions
)(Region);
export default  RegionContainer;

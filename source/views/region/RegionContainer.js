import {connect} from 'react-redux';
import React from 'react';
import createRegion from './Region.js';
import {bindActionCreators} from 'redux'
import * as gtfsActions from 'store/reducers/gtfs';

export const mapStateToProps = (state, ownProps) => {
    return {
        settings: state.settings,
        region: ownProps.region
    };
}
export default connect(
    /***
     * The wrapped component needs access to the settings and a r
     * @param state
     * @returns {{}}
     */
    mapStateToProps, gtfsActions
)(createRegion(React));

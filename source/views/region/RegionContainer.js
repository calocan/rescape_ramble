import {connect} from 'react-redux';
import React from 'react';
import createRegion from './Region.js';
import R from 'ramda';

export default connect(
    /***
     * The wrapped component needs access to the settings and a r
     * @param state
     * @returns {{}}
     */
    (state)=>{
        return {};
    }
)(createRegion(React));

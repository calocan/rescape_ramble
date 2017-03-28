import {connect} from 'react-redux';
import createCurrent from './Current.js';
import React from 'react';
import R from 'ramda';

export default connect(
    /***
     * The only state needed directly by the wrapped component is settings
     * @param state
     * @param props
     * @returns {{}}
     */
    (state)=>{
        return R.merge(
            state['settings']
        );
    }
)(createCurrent(React));

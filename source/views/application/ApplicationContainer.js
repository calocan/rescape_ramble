import {connect} from 'react-redux';
import createApplication from './Application.js';
import React from 'react'

export default connect(
    /***
     * The only state needed directly by the wrapped component is settings
     * @param state
     * @param props
     * @returns {{}}
     */
    (state)=>{
        return {
            ...state['settings']
        };
    }
)(createApplication(React));

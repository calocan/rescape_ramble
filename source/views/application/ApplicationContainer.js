import {connect} from 'react-redux';
import Application from './Application.js';

export default connect(
    /***
     * The only state needed directly by the wrapped component is settings
     * @param state
     * @param props
     * @returns {{}}
     */
    (state, props)=>{
        return {
            ...state.get('settings')
        };
    }
)(Application);

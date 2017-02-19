import {connect} from 'react-redux';
import Region from './Region.js';

export default connect(
    /***
     * The wrapped component needs access to the settings and a r
     * @param state
     * @param props
     * @returns {{}}
     */
    (state, props)=>{
        return {
            ...state.get('settings')
        };
    }
)(Region);

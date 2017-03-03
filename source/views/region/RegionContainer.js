import {connect} from 'react-redux';
import Region from './Region.js';

export default connect(
    /***
     * The wrapped component needs access to the settings and a r
     * @param state
     * @returns {{}}
     */
    (state)=>{
        return {
            ...state.get('settings')
        };
    }
)(Region);

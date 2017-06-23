import {connect} from 'react-redux';
import R from 'ramda';
import Region from './Region.js';
import {actionCreators as geojsonActionCreators} from 'store/reducers/geojson/geojsons';
import openStreetMaps, {actions as openStreetMapActions} from 'store/reducers/geojson/openStreetMaps'

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
    mapStateToProps, geojsonActionCreators
)(Region);

export default RegionContainer;


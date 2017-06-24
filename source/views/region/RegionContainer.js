import {connect} from 'react-redux';
import R from 'ramda';
import Region from './Region.js';
import {geojsonActions as geojsonActions, actionCreators as geojsonActionCreators} from 'store/reducers/geojson/geojsons';
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

const mapDispatchToProps = (dispatch) => {
    return {
        onRegionIsChanged: (options, bounds) => {
            dispatch({
                type: geojsonActions.FETCH_TRANSIT,
                args: [options, bounds]
            })
        },
    };
};

const RegionContainer = connect(
    /***
     * The wrapped component needs access to the settings and a r
     * @param state
     * @returns {{}}
     */
    mapStateToProps, mapDispatchToProps()
)(Region);

export default RegionContainer;


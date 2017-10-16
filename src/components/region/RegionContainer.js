const {connect} = require('react-redux');
const R = require('ramda');
const Region = require('./Region').default;
const {actions} = require('redux/geojson/geojsonReducer');

const mapStateToProps = module.exports.mapStateToProps = (state, ownProps) => {
    return R.merge(
        ownProps,
        {
            settings: state.settings,
            accessToken: ownProps.region.mapbox.mapboxApiAccessToken
        }
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRegionIsChanged: (options, bounds) => {
            dispatch({
                type: actions.FETCH_TRANSIT_DATA,
                args: [options, bounds]
            });
        }
    };
};

const RegionContainer = connect(
    /**
     * The wrapped component needs access to the settings and a r
     * @param state
     * @returns {{}}
     */
    mapStateToProps, mapDispatchToProps()
)(Region);

module.exports.default = RegionContainer;


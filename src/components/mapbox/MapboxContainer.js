/**
 * Created by Andy Likuski on 2017.02.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {connect} = require('react-redux');
const {bindActionCreators} = require('redux');
const {actionCreators} = require('redux/geojson/geojsonReducer');
const {onChangeViewport} = require('redux-map-gl');
const Mapbox = require('./Mapbox').default;
const R = require('ramda');
const {filterByUserSettings} = require('data/userSettingsHelpers');
const {geojsonByType} = require('helpers/geojsonHelpers');
const {toJS} = require('helpers/immutableHelpers');
const {hoverMarker, selectMarker} = actionCreators;
const {createLengthEqualSelector} = require('helpers/reselectHelpers');
const {createSelector} = require('reslect');

/**
 * Resolves the openstreetmap features of a region and categorizes them by type (way, node, relation).
 * Equality is currently based on the length of the features, but we should be able to do this
 * simply by reference equality (why would the features reference change?)
 */
const featuresByTypeSelector = createLengthEqualSelector(
  [
    R.view(R.lensPath(['region', 'geojson', 'osm', 'features']))
  ],
  geojsonByType
);

/**
 * Resolves the marker features of a region and categorizes them by type (way, node, relation)
 */
const markersByTypeSelector = createLengthEqualSelector(
  [
    R.view(R.lensPath(['region', 'geojson', 'markers']))
  ],
  geojsonByType
);

const isSelected = value => value.isSelected;
const userDataSelector = createSelector(
  [
    R.identity,
    state => R.head(state.users),
    featuresByTypeSelector,
    markersByTypeSelector
  ],
  ({settings, regions}, user, featuresByTypeSelector, markersByTypeSelector) => R.applySpec({
    // settings are user-independent
    settings: R.always(settings),
    // pick the user's active region
    data: {
      regions: R.map(R.merge({
        osm: {
          featuresByTypeSelector(),
          markersByTypeSelector()
        }
    }), filterByUserSettings(R.lensPath(['data', 'regions']), isSelected, state, user));
}
})
)
;

const mapboxSelector = createSelector(
  [
    settingsSelector,
    dataSelector
  ],
  (settingsSelector, dataSelector) =>
);

/**
 * Raises viewport, mapboxApiAccessToken, geojson, and gtfs to top level
 * @param {Object} state The Redux state
 * @param {Region} region The Region object
 * @param {Object} style A style object with the width and height
 * @returns {Object} The props
 */
const mapStateToProps = module.exports.mapStateToProps = (state, props) => {
  return {
    region,
    viewport: R.merge(
      toJS(mapbox.viewport),
      // viewport needs absolute width and height from parent
      R.pick(['width', 'height'], style)),
    iconAtlas: mapbox.iconAtlas,
    // TODO showCluster should come in as bool
    showCluster: mapbox.showCluster === 'true',
    featuresByType: featuresByTypeSelector(state),
    markersByType: markersByTypeSelector(state)
  };
};


const mapDispatchToProps = module.exports.mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    onChangeViewport,
    hoverMarker,
    selectMarker
  }, dispatch);
};

module.exports.default = connect(mapStateToProps, mapDispatchToProps)(Mapbox);

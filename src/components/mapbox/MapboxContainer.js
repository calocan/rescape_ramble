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
const {filterMergeByUserSettings} = require('data/userSettingsHelpers');
const {geojsonByType} = require('helpers/geojsonHelpers');
const {toJS} = require('helpers/immutableHelpers');
const {hoverMarker, selectMarker} = actionCreators;
const {createLengthEqualSelector} = require('helpers/reselectHelpers');
const {createSelector, createStructuredSelector} = require('reselect');
const {findOne} = require('rescape-ramda').throwing;
const {v} = require('rescape-validate');
const PropTypes = require('prop-types');

/**
 * Resolves the openstreetmap features of a region and categorizes them by type (way, node, relation).
 * Equality is currently based on the length of the features, but we should be able to do this
 * simply by reference equality (why would the features reference change?)
 * @param {Object} state Should be the region with the
 */
const featuresByTypeSelector = createLengthEqualSelector(
  [
    R.view(R.lensPath(['geojson', 'osm']))
  ],
  geojsonByType
);

/**
 * Resolves the marker features of a region and categorizes them by type (way, node, relation)
 */
const markersByTypeSelector = createLengthEqualSelector(
  [
    R.view(R.lensPath(['geojson', 'markers']))
  ],
  geojsonByType
);

const isSelected = value => value.isSelected;
const isActive = value => value.isActive;
const activeUserSelector = state =>
  findOne(
    isActive,
    state.users
  )
const sel = createStructuredSelector;

/**
 * Creates a substate selector that ignores the full state an applies the substate
 * @param substate
 * @param obj
 * @returns A function that calls createStructuredSelector with substate as the state
 */
const subSel = (substate, obj) => state => createStructuredSelector(obj)(substate);

/**
 * Selector for a particular region.
 * @param {Object} region A region with userSettings for that region merged in
 */
const regionSelector = region => createSelector(
  featuresByTypeSelector,
  markersByTypeSelector,
  (featuresByType, markersByType) =>
    R.merge(region, {
      geojson: {
        osm: {
          featuresByType,
          markersByType
        }
      }
    })
)(region);

/**
 * Selects regions that are associated with this user and currently selected by this user.
 * @param {Object} state The redux state
 * @returns {Object} An object keyed by region id and valued by regions that have merged
 * in userSettings (e.g. isSelected) and derived data
 */
const regionsSelector = state => sel(
  R.map(
    region => state => regionSelector(region),
    filterMergeByUserSettings(
      // Look for the regions container in the state and userSettings
      R.lensPath(['regions']),
      // Look for regions in userSettings with property isSelected
      isSelected,
      // The state
      state,
      // Find the only active user.
      R.head(R.values(
        activeUserSelector(state)
      ))
    )
  )
)(state);

/**
 * Selects top-level data
 */
const dataSelector = sel({
  // pick the user's active region
  regions: regionsSelector
});

/**
 * Selects top-level everything, settings, data, and users
 */

const selector = module.exports.selector = sel({
  settings: state => state.settings,
  data: dataSelector,
  users: activeUserSelector
});

/**
 * Raises viewport, mapboxApiAccessToken, geojson, and gtfs to top level
 * @param {Object} state The Redux state
 * @param {Region} region The Region object
 * @param {Object} style A style object with the width and height
 * @returns {Object} The props
 */
const mapStateToProps = module.exports.mapStateToProps = v((state, props) => {
  return selector(state, props);
  /*
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
   */
},
  [
    ['state', PropTypes.shape({}).isRequired],
    ['props', PropTypes.shape({})]
  ],
  'mapStateToProps'
);


const mapDispatchToProps = module.exports.mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    onChangeViewport,
    hoverMarker,
    selectMarker
  }, dispatch);
};

module.exports.default = connect(mapStateToProps, mapDispatchToProps)(Mapbox);

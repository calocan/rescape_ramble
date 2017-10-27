/**
 * Created by Andy Likuski on 2017.10.17
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {createSelector, createSelectorCreator, createStructuredSelector, defaultMemoize} = require('reselect');
const R = require('ramda');
const {findOne, reqPath} = require('rescape-ramda').throwing;
const {geojsonByType} = require('helpers/geojsonHelpers');
const {propLensEqual} = require('./componentHelpers');
const PropTypes = require('prop-types');
const {v} = require('rescape-validate');
const {filterMergeByUserSettings} = require('data/userSettingsHelpers');
const {mapped} = require('ramda-lens');

/**
 * Creates a reselect selector creator that compares the length of values of the
 * selected object from one call to the next to determine equality instead of doing and equals check.
 * This is used for large datasets like geojson features where we assume no change unless the list size changes
 */
const createLengthEqualSelector = module.exports.createLengthEqualSelector =
  createSelectorCreator(
    defaultMemoize,
    propLensEqual(R.lensProp('length'))
  );

const settingsSelector = state => state.settings;


/**
 * Object states
 * @type {{IS_SELECTED: string, IS_ACTIVE: string}}
 */
const ESTADO = module.exports.ESTADO = {
  IS_SELECTED: 'isSelected',
  IS_ACTIVE: 'isActive'
};

/**
 * Object to lookup the a particular estado
 * @type {{}}
 */
const esta = module.exports.esta = R.fromPairs(
  R.map(
    estado => [estado, R.prop(estado)],
    [ESTADO.IS_SELECTED, ESTADO.IS_ACTIVE]
  )
);

/**
 * Returns the active user by searching state.users for the one and only one isActive property
 * that is true
 * @param state
 */
const activeUserSelector = module.exports.activeUserSelector = state =>
  findOne(
    esta[ESTADO.IS_ACTIVE],
    state.users
  );

/**
 * Resolves the openstreetmap features of a region and categorizes them by type (way, node, relation).
 * Equality is currently based on the length of the features, but we should be able to do this
 * simply by reference equality (why would the features reference change?)
 * @param {Object} state Should be the region with the
 */
const makeFeaturesByTypeSelector = module.exports.makeFeaturesByTypeSelector = () => createLengthEqualSelector(
  [
    R.view(R.lensPath(['geojson', 'osm']))
  ],
  geojsonByType
);

/**
 * Resolves the marker features of a region and categorizes them by type (way, node, relation)
 */
const makeMarkersByTypeSelector = module.exports.makeMarkersByTypeSelector = () => createLengthEqualSelector(
  [
    R.view(R.lensPath(['geojson', 'markers']))
  ],
  geojsonByType
);

/**
 * Selector for a particular region that merges in derived data structures
 * @param {Object} region A region with userSettings for that region merged in
 */
const makeRegionSelector = module.exports.makeRegionSelector = () => region => createSelector(
  [
    makeFeaturesByTypeSelector(),
    makeMarkersByTypeSelector()
  ],
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
const regionsSelector = module.exports.regionsSelector = state => createStructuredSelector(
  R.map(
    region => state => makeRegionSelector()(region),
    filterMergeByUserSettings(
      // Look for the regions container in the state and userSettings
      R.lensPath(['regions']),
      // Look for regions in userSettings with property isSelected
      esta[ESTADO.IS_SELECTED],
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
 * This selector creates a state that narrows down the state to the active user and region,
 * remove any users that are not active and any regions that are not selected.
 * Any ComponentContainer that must operate in the context of a single user and region can
 * use this selector, or more likely receive this state from their parent component.
 * @returns {Function} A reselect selector that is called with state and props and returns
 * an object containing settings, regions, and users, where regions and users must limited to
 * one each
 */
module.exports.activeUserAndRegionStateSelector = createStructuredSelector({
  settings: settingsSelector,
  regions: regionsSelector,
  users: activeUserSelector
});

/**
 * Makes a selector that expects a state containing regions,
 * which each contain a Mapbox viewport
 * @param {Object} state The Redux state. This can be the full state or one modified for current selections
 * @param {Object} state.regions The regions object. Usually one region is expected
 * Each region contains a {mapbox: viewport: {...}}
 * @returns {Object} An object keyed by region and valued by viewport or that region's Mapbox
 */
module.exports.makeViewportsSelector = () => {
  const regionsMapboxVieportLens = R.compose(mapped, R.lensPath(['mapbox', 'viewport']));
  return createSelector(
    [regionsSelector],
    R.view(regionsMapboxVieportLens)
  );
};

/**
 * Determines the mapbox settings from the general settings.
 * TODO we could merge user overrides here in the future
 * @returns {Object} The mapbox settings
 */
module.exports.mapboxSettingsSelector = createSelector(
  [
    state => reqPath(['settings', 'mapbox'], state)
  ],
  R.identity
);

/**
 * Extracts the browser window dimensions from the state to pass to props
 * that resize based on the browser
 */
module.exports.browserDimensionsSelector = createSelector(
  [
    R.compose(
      R.pick(['width', 'height']),
      reqPath(['browser', 'extraFields'])
    )
  ],
  R.identity
);
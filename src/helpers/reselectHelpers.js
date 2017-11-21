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
const {mergeDeep} = require('rescape-ramda');
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
  // Use propLensEqual as the equality check to defaultMemoize
  createSelectorCreator(
    defaultMemoize,
    propLensEqual(R.lensProp('length'))
  );

/**
 * Default settings selector, which passes all settings through
 * @param state
 */
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
    mergeDeep(region, {
      geojson: {
        osm: {
          featuresByType,
          markersByType
        }
      }
    })
)(region);

/**
 * Creates a selector that selects regions that are associated with this user and currently selected by this user.
 * @param {Object} state The redux state
 * @returns {Object} An object keyed by region id and valued by regions that have merged
 * in userSettings (e.g. isSelected) and derived data
 */
const makeRegionsSelector = module.exports.regionsSelector = () => state => createStructuredSelector(
  R.map(
    // Each region needs to make its own regionSelector.
    // TODO This should only happen once per region, so we need a memoize algorithm that caches on region id
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
module.exports.makeActiveUserAndRegionStateSelector = () => {
  createStructuredSelector({
    settings: settingsSelector,
    regions: makeRegionSelector(),
    users: activeUserSelector,
  });
};

/**
 * Makes a selector that expects a state containing regions, which each contain a Mapbox viewport
 * @param {Object} state The Redux state. This can be the full state or one modified for current selections
 * @param {Object} state.regions The regions object. Usually one region is expected
 * Each region contains a {mapbox: viewport: {...}}
 * @returns {Object} An object keyed by region and valued by viewport of that region's Mapbox
 */
module.exports.makeViewportsSelector = () => {
  const regionsMapboxVieportLens = R.compose(mapped, R.lensPath(['mapbox', 'viewport']));
  return createSelector(
    [makeRegionsSelector()],
    R.view(regionsMapboxVieportLens)
  );
};

/**
 * Makes a selector that expects a state containing regions, which each contain a geojson property
 * @param {Object} state The Redux state. This can be the full state or one modified for current selections
 * @param {Object} state.regions The regions object. Usually one region is expected
 * Each region contains a {geojson: ...}
 * @return {Object} An object keyed by region and valued by geojson
 */
const makeGeojsonSelector = module.exports.makeGeojsonsSelector = () => state => {
  const regionsGeojsonLens = R.compose(mapped, R.lensPath(['geojson']));
  return createSelector(
    [makeRegionsSelector()],
    R.view(regionsGeojsonLens)
  )(state);
};

module.exports.makeGeojsonLocationsSelector = () => state => {
  const geojsonLocationLens = R.compose(mapped, R.lensPath(['locations']));
  return createSelector(
    [makeGeojsonSelector()],
    R.view(geojsonLocationLens)
  )(state);
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
const browserDimensionsSelector = module.exports.browserDimensionsSelector = createSelector(
  [
    R.compose(
      R.pick(['width', 'height']),
      reqPath(['browser'])
    )
  ],
  R.identity
);

/** *
 * Creates a selector that resolves the browser width and height from the state and multiplies each by the fraction
 * stored in the local props (which can either come from parent or from the component's style). If props
 * width or height is not defined they default to 1
 * @props {Object} state Expected to have a browser.[width and height]
 * @props {Object} props Expected to have a style.[width and height]
 * @returns {Object} a width and height relative to thte browser.
 */
module.exports.makeBrowserProportionalDimensionsSelector = () => (state, props) => createSelector(
  [browserDimensionsSelector],
  dimensions => ({
    width: R.multiply(R.pathOr(1, ['style', 'width'], props), R.prop('width', dimensions)),
    height: R.multiply(R.pathOr(1, ['style', 'height'], props), R.prop('height', dimensions))
  })
)(state, props);

/**
 * For selectors that expects the state and props pre-merged.
 * Usage: (state, props) => R.compose(selector, mergeStateAndProps)(state, props)
 * This will call mergeStateAndProps with state and props and then call selector with just the merged
 * value. selectors should only take state and props separately when there is something specifically
 * different about what is expected in the state versus the props, such as for
 * makeBrowserProportionalDimensionsSelector, where the state and only the state must contain browser
 * dimenions.
 * @param state
 * @param props
 */
module.exports.mergeStateAndProps = (state, props) => mergeDeep(state, props);

const defaultStyleSelector = (state, props) => reqPath(['styles', 'default'], state);

const mergeDeepWith = R.curry((fn, left, right) => R.mergeWith((l, r) => {
  // If either (hopefully both) items are arrays or not both objects
  // accept the right value
  return ((l && l.concat && R.is(Array, l)) || (r && r.concat && R.is(Array, r))) || !(R.is(Object, l) && R.is(Object, r)) ?
    fn(l, r) :
    mergeDeepWith(fn, l, r); // tail recursive
})(left, right));

/**
 * Merges two style objects, where the second can have functions to apply the values of the first.
 * If matching key values are both primitives, the style value trumps
 * @param {Object} parentStyle Simple object of styles
 * @param {Object} style Styles including functions to transform the corresponding key of parentStyle
 */
const mergeStyles = (parentStyle, style) => mergeDeepWith(
  (stateStyleValue, propStyleValue) =>
    // If keys match, the propStyleValue trumps unless it is a function, in which case the stateStyleValue
    // is passed to the propStyleValue function
    R.when(
      R.is(Function),
      x => R.compose(x)(stateStyleValue)
    )(propStyleValue),
  parentStyle,
  style
);

/**
 * Returns a function that creates a selector to
 * merge the defaultStyles in the state with the style object of the given props
 * @param {Object} state The Redux state
 * @param {Object} state.styles.default The default styles. These should be simple values
 * @param {Object} [props] Optional The props
 * @param {Object} [props.style] Optional The style object with simple values or
 * unary functions to transform the values from the state (e.g. { margin: 2, color: 'red', border: scale(2) })
 * where scale(2) returns a function that transforms the border property from the state
 * @returns {Object} The merged object
 */
module.exports.makeMergeDefaultStyleWithProps = () => (state, props) => createSelector(
  [defaultStyleSelector],
  defaultStyle => mergeStyles(defaultStyle, R.propOr({}, 'style', props))
)(state, props);

/**
 * Like makeMergeDefaultStyleWithProps but used to merge the container style props with the component style props
 * @param {Object} containerProps The props coming from the container, which themselves were merged with the
 * state styles and/or parent components
 * @param {Object} style The style object with simple values
 * @param {Object} [props] Optional The props The style object with simple values or
 * unary functions to transform the values from the containerProps (e.g. { margin: 2, color: 'red', border: scale(2) })
 * where scale(2) returns a function that transforms the border property from the containerProps
 * @returns {Object} The merged object
 */
module.exports.makeMergeContainerStyleProps = () => (containerProps, style) => createSelector(
  [
    containerProps => reqPath(['style'], containerProps),
    (_, props) => R.defaultTo({}, props)
  ],
   mergeStyles
)(containerProps, style);

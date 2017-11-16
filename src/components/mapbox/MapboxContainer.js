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

const {filterWithKeys} = require('rescape-ramda');
const {connect} = require('react-redux');
const {bindActionCreators} = require('redux');
const {actionCreators} = require('redux/geojson/geojsonReducer');
const {onChangeViewport} = require('redux-map-gl');
const Mapbox = require('./Mapbox').default;
const {hoverMarker, selectMarker} = actionCreators;
const {makeMergeDefaultStyleWithProps, makeViewportsSelector, makeActiveUserAndRegionStateSelector, mapboxSettingsSelector} = require('helpers/reselectHelpers');
const {createSelector} = require('reselect');
const R = require('ramda');
const {mergePropsForViews, makeTestPropsFunction} = require('helpers/componentHelpers');

/**
 * Limits the state to the current selections
 * TODO does this need to be a Creator.
 * TODO should this be moved up to a parent and just take incoming props as state
 * @returns {Object} The props
 */
const mapStateToProps = module.exports.mapStateToProps =

  createSelector(
    [
      makeActiveUserAndRegionStateSelector(),
      makeMergeDefaultStyleWithProps(),
      mapboxSettingsSelector
    ],
    (selectedState, style, mapboxSettings) => {
      const viewport = makeViewportsSelector()(selectedState);
      return R.mergeAll([
        selectedState,
        {style}, {
          views: {
            // Child component mapGl needs the following props
            // Note that viewport is a functor, hence the mapping
            mapGl: {
              items: R.map(
                viewport => R.merge(
                  mapboxSettings, {viewport}
                ),
                viewport
              )
            }
          }
        }]);
    }
  );
/*
 region,
 viewport: R.merge(
 toJS(mapbox.viewport),
 // viewport needs absolute width and height from parent
 R.pick(['width', 'height'], style)),
 iconAtlas: mapbox.iconAtlas,
 // TODO showCluster should come in as bool
 showCluster: mapbox.showCluster === 'true',
 featuresByType: makeFeaturesByTypeSelector()(state),
 markersByType: makeMarkersByTypeSelector()(state)
 };
 */


const mapDispatchToProps = module.exports.mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    onChangeViewport,
    hoverMarker,
    selectMarker
  }, dispatch);
};


const mergeProps = module.exports.mergeProps = mergePropsForViews({
  // MapGl child component needs the following actions
  mapGl: ['onChangeViewport', 'hoverMarker', 'selectMarker']
});

// Returns a function that expects a sample state and ownProps for testing
module.exports.testPropsMaker = makeTestPropsFunction(mapStateToProps, mapDispatchToProps, mergeProps);

module.exports.default = connect(mapStateToProps, mapDispatchToProps, mergeProps);


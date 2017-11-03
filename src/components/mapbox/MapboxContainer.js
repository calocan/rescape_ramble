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
const {hoverMarker, selectMarker} = actionCreators;
const {makeViewportsSelector, makeActiveUserAndRegionStateSelector, mapboxSettingsSelector} = require('helpers/reselectHelpers');
const {createSelector} = require('reselect');
const R = require('ramda');

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
      mapboxSettingsSelector
    ],
    (selectedState, mapboxSettings) => {
      const viewport = makeViewportsSelector()(selectedState);
      return R.merge(selectedState, {
        views: {
          mapGl: R.merge({
              viewport
            },
            mapboxSettings
          )
        }
      });
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

module.exports.default = connect(mapStateToProps, mapDispatchToProps)(Mapbox);

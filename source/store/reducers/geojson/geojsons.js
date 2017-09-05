/**
 * Created by Andy Likuski on 2017.04.27
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const {combineReducers} = require('redux');
const {mapDefaultAndPrefixOthers} = require('rescape-ramda');

const {markers, markerActions, markerActionCreators} = mapDefaultAndPrefixOthers('markers', 'marker', require('store/reducers/geojson/markers'));
const {openStreetMaps, openStreetMapActions, openStreetMapActionCreators} = mapDefaultAndPrefixOthers('openStreetMaps', 'openStreetMap',  require('store/reducers/geojson/openStreetMaps'));
const {searches, searchesActions, searchesActionCreators} = mapDefaultAndPrefixOthers('searches', 'search', require('store/reducers/geojson/searches'));

module.exports.SCOPE = 'geojson';
module.exports.actions = R.mergeAll([markerActions, openStreetMapActions, searchesActions]);
module.exports.actionCreators = R.mergeAll([markerActionCreators, openStreetMapActionCreators, searchesActionCreators]);

/**
 @typedef Geojson
 @type {Object}
 @property {[Number]} bounds A four element array representing the bounds [min lon, min lat, max lon, max lat]
 @property {geojson} osm OpenStreetMap geojson data
 @property {geojson} markers Point data representing markers in geojson format
 */

module.exports.default = () => {
    return combineReducers({
        osm: openStreetMaps,
        markers: markers,
        searches: searches
    });
};


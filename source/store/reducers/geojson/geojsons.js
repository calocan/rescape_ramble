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

const markersImport = require('store/reducers/geojson/markers').default;
const markers = markersImport.default;
const [markerActionTypes, markerActionCreators] = [markersImport.actions, markersImport.actionCreators];

const openStreetMapsImport = require('store/reducers/geojson/openStreetMaps').default;
const openStreetMaps = markersImport.default;
const [openStreetMapActionTypes, openStreetMapActionCreators] = [openStreetMapsImport.actions, openStreetMapsImport.actionCreators];

const searchesImport = require('store/reducers/geojson/searches').default;
const searches = searchesImport.default;
const [searchesActionTypes, searchesActionCreators] = [searchesImport.actions, searchesImport.actionCreators];

module.exports.SCOPE = 'geojson';
module.exports.actions = R.mergeAll([markerActionTypes, openStreetMapActionTypes, searchesActionTypes]);
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


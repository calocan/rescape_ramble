/**
 * Created by Andy Likuski on 2017.05.08
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import R from 'ramda';
const reduceFeaturesBy = R.reduceBy((acc, feature) => acc.concat(feature), []);
const regex = /(.+)\/\d+/;
// Get the feature by type based on its id
// featuresByType:: Feature f = [f] -> <String, [f]>
const featureByType = reduceFeaturesBy(feature => R.match(regex, feature.id)[1]);

/***
 * Split geojson by feature type
 * @param {Object} geojson
 * @param {[Feature]} osm.features Features that are way, node, or route according to their id
 * @return {Object} Copies of the gtfs with a single type of Feature
 * geojsonByType:: geojson g = g -> <String, g>
 */
export const geojsonByType = R.curry((geojson) => R.map(
    // Make a copy of the geojson with the typed features
    featureOfType => R.set(R.lensProp('features'), featureOfType, geojson),
    featureByType(geojson.features) // Reduce by feature type
));
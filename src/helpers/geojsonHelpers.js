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

const R = require('ramda');
const reduceFeaturesBy = R.reduceBy((acc, feature) => acc.concat(feature), []);
const regex = /(.+)\/\d+/;
// Get the feature by type based on its id
// featuresByType:: Feature f = [f] -> <String, [f]>
const featureByType = module.exports.featureByType = reduceFeaturesBy(feature => R.match(regex, feature.id)[1]);

/**
 * Split geojson by feature type
 * @param {Object} osm
 * @param {[Feature]} osm.features Default []. Features that are way, node, or route according to their id
 * @returns {Object} Copies of the gtfs with a single type of Feature
 * geojsonByType:: geojson g = g -> <String, g>
 */
module.exports.geojsonByType = osm => {
  return R.map(
    // Make a copy of the geojson with the typed features
    featureOfType => R.set(R.lensProp('features'), featureOfType, osm),
    featureByType(R.pathOr([], ['features'], osm)) // Reduce by feature type
  );
};

/**
 * Fetch each square of transit and merge the results by feature id
 * concatValues combines are results sets when they return
 * @param {String} k The key of the object being tested.
 * @param {[Feature]} l The left side Features
 * @param {[Feature]} r The right side Features
 * @returns {Object} The concatted features
 */
module.exports.concatFeatures = (k, l, r) => k === 'features' ? R.concat(l, r) : r;

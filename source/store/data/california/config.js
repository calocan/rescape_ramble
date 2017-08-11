/**
 * Created by Andy Likuski on 2017.03.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda')
const {mapDefault, mergeDeep, mapKeyForLens, mapPropValueAsIndex} = require('helpers/functions');
const {defaultConfig, extractTemplate} = mapDefault('defaultConfig', require('store/data/default/config'))
const journeys = require('./journeys.json').default;
const locations = require('./locations.json').default;
const routes = require('./routes').default;
const routeTypes = require('store/data/default/routeTypes');
const trips = require('./trips').default;
const stops = require('./stops').default;
const {reqPath} = require('helpers/throwingFunctions');

// Merge the default Region template with our Region
const defaultRegion = extractTemplate('default', R.lens('regions'), defaultConfig)
const defaultConfigNoTemplates = R.omit(['regions'], defaultConfig)

/**
 * California configuration
 * @type {*}
 */
module.exports.default = mergeDeep(
    defaultConfigNoTemplates,
    {regions: [ mergeDeep(defaultRegion, {
        id: 'california',

        gtfs: {
            routes,
            trips,
            stops,
            routeTypes: [routeTypes.INTER_REGIONAL_RAIL_SERVICE]
        },

        travel: {
            journeys,
            locations
        },

        geospatial: {
            // bounds: [-125, 31, -113, 43]
            bounds: [-122.720306, 37.005783, -121.568275, 38.444660]
        },

        mapbox: {
            viewport: {
                latitude: 37,
                longitude: -119,
                zoom: 5
            }
        }
    })]}
);

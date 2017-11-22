/**
 * Created by Andy Likuski on 2017.02.23
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const journeys = require('./parisJourneys.sample.json');
const locations = require('./parisUserLocations.sample.json');
const routes = require('./parisRoutes.sample').default;
const routeTypes = require('data/default/routeTypes');
const {applyDefaultRegion} = require('data/configHelpers');
const trips = require('./parisTrips.sample').default;
const stops = require('./parisStops.sample').default;
const osm = require('./parisOsm.sample').default;
const {throwing: {reqPath}} = require('rescape-ramda');

// merge the default region template with our region(s)
module.exports.default = applyDefaultRegion({
  paris: {
    id: 'paris',

    geojson: {
      osm,
      // Make these the same as osm features for now
      locations: reqPath(['features'], osm)
    },

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
  }
});

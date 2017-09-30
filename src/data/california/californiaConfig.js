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

const R = require('ramda');
const {mergeDeep} = require('rescape-ramda');
const {defaultConfig,
  userTemplateKeys: { REGION_MANAGER, REGION_USER, REGION_VISITOR },
  permissions: {ADMINISTRATE, MANAGE, USE, VISIT}} = require('data/default');
const journeys = require('./californiaJourneys.json');
const locations = require('./californiaUserLocations.json');
const routes = require('./californiaRoutes').default;
const routeTypes = require('data/default/routeTypes');
const {mapDefaultRegion, mapDefaultUsers} = require('data/configHelpers');
const trips = require('./californiaTrips').default;
const stops = require('./californiaStops').default;

// Create three users
const users = {
  CALIFORNIA_MANAGER: 'californiaManager',
  CALIFORNIA_USER: 'californiaUser',
  CALIFORNIA_VISITOR: 'californiaVisitor'
};

/**
 * California configuration
 * @type {*}
 */
module.exports.default = mergeDeep(
  // merge the default region template with our region(s)
  R.compose(
    mapDefaultUsers({
      [REGION_MANAGER]: [users.CALIFORNIA_MANAGER],
      [REGION_USER]: [users.CALIFORNIA_USER],
      [REGION_VISITOR]: [users.CALIFORNIA_VISITOR]
    }),
    mapDefaultRegion(['california']),
  )(defaultConfig),
  {
    regions: {
      'california': {
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
      }
    },
    users: {
      [users.CALIFORNIA_MANAGER]: {
        id: users.CALIFORNIA_MANAGER,
        name: 'Jerry Brown'
      },
      [users.CALIFORNIA_USER]: {
        id: users.CALIFORNIA_USER,
        name: 'Nancy Pelosi'
      },
      [users.CALIFORNIA_VISITOR]: {
        id: users.CALIFORNIA_VISITOR,
        name: 'Angela Merkel'
      },
    }
  }
);

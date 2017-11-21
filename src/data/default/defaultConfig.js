/**
 * Created by Andy Likuski on 2017.03.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const environment = R.propOr('development', 'NODE_ENV', process.env);
const {environmentConfig} = require(`environments/${environment}Config`);
const routeTypes = require('./routeTypes');
const {DEFAULT_SERVICE, WEEKEND_SERVICE} = require('./services');
const {mergeDeep} = require('rescape-ramda');
const {users} = require('./defaultUsers');
const {defaultStyles} = require('styles/styles');

module.exports.defaultConfig = mergeDeep(environmentConfig, {
  regions: {
    default: {
      gtfs: {
        calendar: [
          DEFAULT_SERVICE,
          WEEKEND_SERVICE
        ],
        routeTypes: routeTypes
      },
      geojson: {
        locations: {},
        osm: {},
        searches: {}
      },
      mapbox: {
        mapStyle: 'mapbox://styles/mapbox/streets-v8',
        viewport: {
          pitch: 40,
          bearing: 0,
          startDragLngLat: null,
          isDragging: false,

          latitude: 0,
          longitude: 0,
          zoom: 1
        }
      }
    }
  },
  // These are all just templates that can be merged with real users
  users,
  // Style data
  styles: {
    // Defaults can be merged with container props and props defined on the component
    default: defaultStyles
  }
});

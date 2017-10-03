/**
 * Created by Andy Likuski on 2017.02.27
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Creates default TripPair objects
 */

const stops = require('./parisStops.sample').default;
const w = require('./parisStops.sample').default;
const routes = require('./parisRoutes.sample').default;
const {createTripWithStopTimesPair, orderStops, stopTimeGenerator} = require('data/dataCreationHelpers');
const {stopResolver, routeResolver} = require('data/dataQueryHelpers');
const places = require('./parisPlaces.sample');
const regions = require('./parisRegions.sample');
const {DEFAULT_SERVICE} = require('data/default/services');

const resolveStop = stopResolver(stops);
const resolveRoute = routeResolver(routes);


/**
 * Creates a TripPair and then augments each trip with the StopTimes
 */
module.exports.default = [
    ...createTripWithStopTimesPair(
        resolveRoute(places.SAN_FRANCISCO, places.RENO, regions.NORTH_BAY),
        DEFAULT_SERVICE,
        trip => {
            return stopTimeGenerator(
                trip,
                orderStops(trip, [
                    resolveStop(places.SAN_FRANCISCO, w.TRANSBAY),
                    resolveStop(places.OAKLAND, w.CENTRAL),
                    resolveStop(places.SUISON_FAIRFIELD, w.AMTRAK),
                    resolveStop(places.SACRAMENTO, w.AMTRAK),
                    resolveStop(places.TRUCKEE, w.AMTRAK),
                    resolveStop(places.RENO, w.AMTRAK)
                ]),
                '09:00', '12:00', 60);
        }
    ),
    ...createTripWithStopTimesPair(
        resolveRoute(places.SAN_FRANCISCO, places.RENO, regions.ALTAMONT),
        DEFAULT_SERVICE,
        trip => {
            return stopTimeGenerator(
                trip,
                orderStops(trip, [
                    resolveStop(places.SAN_FRANCISCO, w.TRANSBAY),
                    resolveStop(places.OAKLAND, w.CENTRAL),
                    resolveStop(places.STOCKTON, w.AMTRAK),
                    resolveStop(places.SACRAMENTO, w.AMTRAK),
                    resolveStop(places.TRUCKEE, w.AMTRAK),
                    resolveStop(places.RENO, w.AMTRAK)
                ]),
                '09:10', '12:20', 60);
        }
    )
];

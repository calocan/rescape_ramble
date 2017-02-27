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
import test from 'tape-catch';
import { createStop, createRoute, createTripPair, createService, stopTimeGenerator, stopResolver } from './dataCreationHelpers';
import * as places from './places';
import * as regions from './regions';
import * as routeTypes from './routeTypes';
import stops, * as w from './stops'

test('dataCreationHelpers', t => {
    const fromStop = createStop(
        places.SAN_FRANCISCO, w.TRANSBAY,
        { lon: -122.277158, lat: 37.806624 }
    );
    const toStop = createStop(
        places.RENO, w.AMTRAK,
        { lon: -122.277158, lat: 37.806624 }
    );
    t.ok(fromStop);
    t.ok(toStop);
    //expect(stops).toMatchSnapshot();

    const route = createRoute(
        places.SAN_FRANCISCO,
        places.RENO,
        { via: regions.NORTH_BAY, routeType: routeTypes.INTER_REGIONAL_RAIL_SERVICE.id}
    );
    //expect(route).toMatchSnapshot();
    const service = createService('20000101', '20991231');
    t.ok(service.id);

    const tripPair = createTripPair(
        route,
        { via: regions.NORTH_BAY, routeId: route.id, serviceId: service.id }
    );
    t.equals(tripPair, tripPair.length, "It creates two trips");

    // Resolve the Stops of this trip
    const resolveTripStop = stopResolver(stops);
    const tripStops = [
        [places.SAN_FRANCISCO, w.TRANSBAY],
        [places.OAKLAND, w.CENTRAL],
        [places.SUISON_FAIRFIELD, w.AMTRAK],
        [places.SACRAMENTO, w.UNION],
        [places.TRUCKEE, w.AMTRAK],
        [places.RENO, w.AMTRAK]
    ].map(([place, which]) => resolveTripStop(place, which));
    // Specify the startTime and endTime of each trip direction
    const tripPairDetails = [
        {trip: tripPair[0], stops: tripStops, startTime: '08:00:00', endTime: '12:30:00'},
        {trip: tripPair[1], stops: tripStops.reverse(), startTime: '08:00:00', endTime: '12:00:00'}
    ];
    // Create an object keyed by trip.id and valued by StopTimes
    const tripPairToStopTimes = Map(
        tripPairDetails.map(({trip, stops, startTime, endTime}, index) => {
            const stops = index == 0 ? stops : stops.reverse();
            return [
                trip.id,
                Array.from(
                    stopTimeGenerator(trip.id, stops, startTime, endTime, 60)
                )
            ];
        })
    );
    t.equals(tripPairToStopTimes.keys().length, 2);
    tripPairToStopTimes.forEach((stopTimes, tripStops) => {
        t.deepEquals(
            stopTimes.map(stopTime => stopTime.tripId),
            tripStops.map(tripStop => tripStop.id),
            'Expected generated StopTime Trip ids to match tripStop ids'
        )
    })
});
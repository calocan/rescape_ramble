/**
 * Created by Andy Likuski on 2017.02.23
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import test from 'tape-catch';
import { createService, createStop, createRoute, createTripWithStopTimesPair, stopTimeGenerator, orderStops } from './dataCreationHelpers';
import { stopResolver } from './dataQueryHelpers'

export const INTER_REGIONAL_RAIL_SERVICE = {'id': '103', 'description': 'Inter Regional Rail Service', 'supported': true};
export const NORTH_BAY = 'North-Bay';
export const ALTAMONT = 'Altamont';
export const DEFAULT_SERVICE = createService('20000101', '20991231');
export const SAN_FRANCISCO = {id: 'SFC', label: 'San Francisco'};
export const SUISON_FAIRFIELD = {id: 'SUI', label: 'Suison-Fairfield'};
export const RENO = {id: 'REN', label: 'Reno'};
export const UNION = 'Union';
export const CENTRAL = 'Central';
export const AMTRAK = 'Amtrak';

test('dataCreationHelpers', t => {

    const route = createRoute(
        SAN_FRANCISCO,
        RENO,
        { via: NORTH_BAY, routeType: INTER_REGIONAL_RAIL_SERVICE.id}
    );

    const fromStop = createStop(
        SAN_FRANCISCO, CENTRAL,
        { lon: -122.277158, lat: 37.806624 }
    );
    t.ok(fromStop);
    const viaStop = createStop(
        SUISON_FAIRFIELD, AMTRAK,
        { lon: -122.041192, lat: 38.243449 },
    );
    const toStop = createStop(
        RENO, AMTRAK,
        { lon: -122.277158, lat: 37.806624 }
    );
    const stops = [fromStop, viaStop, toStop];
    //expect(stops).toMatchSnapshot();

    //expect(route).toMatchSnapshot();
    const tripPair = createTripWithStopTimesPair(
        route,
        DEFAULT_SERVICE,
        trip => stopTimeGenerator(trip, orderStops(trip, stops), '09:00', '12:00', 60)
    );
    t.equals(tripPair.length, 2, 'It creates two trips');

    // Resolve the Stops of this trip
    const resolveStop = stopResolver(stops);
    [
        [SAN_FRANCISCO, CENTRAL],
        [SUISON_FAIRFIELD, AMTRAK],
        [RENO, AMTRAK]
    ].forEach(([place, which]) => {
        t.ok(resolveStop(place, which));
    });

    tripPair.forEach(trip => {
        t.deepEquals(
            trip.stopTimes.map(stopTime => stopTime.stop),
            stops,
            'Expected generated StopTime Trip ids to match tripStop ids'
        )
    })
});

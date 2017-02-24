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
import { createStop, createRoute, createTripPair, resolveStop } from './dataCreationHelpers'
import { SAN_FRANCISCO, RENO, NORTH_BAY } from './places'
import * as routeTypes from './routeTypes.js'

test('dataCreationHelpers', t => {
    const fromStop = createStop(
        SAN_FRANCISCO,
        { lon: -122.277158, lat: 37.806624 },
        { where: 'Transbay' }
    );
    const toStop = createStop(
        RENO,
        { lon: -122.277158, lat: 37.806624 }
    );
    const stops = Object.assign(fromStop, toStop);
    t.equals(stops.keys().length, 4, "Four stops were created");
    expect(stops).toMatchSnapshot();

    const route = createRoute(
        SAN_FRANCISCO,
        RENO,
        { via: NORTH_BAY, routeType: routeTypes.INTER_REGIONAL_RAIL_SERVICE.id}
    );
    expect(route).toMatchSnapshot();
    const serviceId = createService();


    const tripPair = createTripPair(
        route,
        { via: NORTH_BAY, routeId: route.id, serviceId: service.id }
    );

    t.deepEqual(tripPair, expected, "It creates two trips");
    t.deepEqual(
        resolveStop(
            Object.assign(fromStop, toStop), fromStop),
            SAN_FRANCISCO
        ),
        fromStop,
        "resolveStop resolves the stop"
    );
}
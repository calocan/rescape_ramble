/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {OrderedMap, Map, List, Set, fromJS} from 'immutable'
import routeTypes from './routeTypes.json'
import journeys from './journeys.json'
import locations from './locations.json'
import routes from './routes.js'
import {createTripPair} from './dataCreationHelpers'

export default OrderedMap({

    // User journeys. not GTFS. This should always be seeded with an initial journey for demonstration purposes
    journeys: fromJS(journeys),
    // User locations, not GTSF. This should be seeded with whatever the journeys point to
    locations: fromJS(locations),

    // Defines service type. id is service_id in the GTFS specification
    // days are separate fields marked with 1 or 0
    calendar: Map({
        daily: Map({
            id: 'daily',
            startDate: '20160101',
            endDate: '21000101',
            days:['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
        }),
        weekend: Map({
            id: 'weekend',
            startDate: '20160101',
            endDate: '21000101',
            days:['saturday','sunday']
        })
    }),

    // Mode/vehicle/service type
    routeTypes: fromJS(routeTypes),

    // Bidirectional transit routes
    routes: routes,

    trips: Map(Object.assign(
        TripPair(SAN_FRANCISCO, RNO, {via: NORTH_BAY, routeId:, serviceId: , directionId:, tripHeadsign})

        [SFC_RNO_NORTH_BAY]: Map({
            id: SFC_RNO_NORTH_BAY
            routeId: '1487725963417',
            serviceId: 'daily',
            directionId: '0',
            tripHeadsign: 'Reno via North Bay'
        }),
        [RNO_SFC_NORTH_BAY]: Map({
            id: RNO_SFC_ALTAMONT
            routeId: '1487725963417',
            serviceId: 'daily',
            directionId: '1',
            tripHeadsign: 'San Francisco via North Bay'
        }),
        [RNO-SAN_FRANCISCO-ALTAMONT]: Map({
            id: RNO_SFC_ALTAMONT
            routeId: '1487725963417',
            serviceId: 'daily',
            directionId: '0',
            tripHeadsign: 'Reno via Altamont Pass'
        }),
        [SFC_RNO_ALTAMONT]: Map({
            id: SFC_RNO_ALTAMONT,
            routeId: '1487725963417',
            serviceId: 'daily',
            directionId: '1',
            tripHeadsign: 'San Francisco via Altamont Pass'
        }),
    )),

    // The stops of fixed guideway transit service. These are the nodes of the graph
    stops: fromJS(stops)),

    stopTimes: Map({
        '1487733882833': Map({
            tripId: 'SAN_FRANCISCO-RNO-North-Bay',
            stopSequence: '1',
            stopId: 'SAN_FRANCISCO-Central',
            arrivalTime: '9:00:00',
            departureTime: '9:00:00',
        })
    }),

    // The transit lines connecting each stop. These are the line segments of the graph
    lines: Map({
        // San Francisco to Oakland
        '1487639656930': Map({
            id:'1487639656930',
            mode: '1487639691538',
            tracks: 2,
            stopPair: Set([
                'SAN_FRANCISCO-Central',
                'OAKLAND-Central'
            ]),
        }),
        // Oakland to Pleasanton
        '1487640291761': Map({
            id:'1487640291761',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                'OAKLAND-Central',
                'PLS-Central'
            ]),
        }),
        // Pleasonton to Stockton
        '1487640299074': Map({
            id:'1487640299074',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                'PLS-Central',
                'STOCKTON-Central'
            ]),
        }),
        // Stockton to Sacramento
        '1487640304649': Map({
            id:'1487640304649',
            mode: '1487639656930',
            tracks: 4,
            stopPair: Set([
                'STOCKTON-Central',
                'SAC-Central'
            ]),
        }),
        // Oakland to Fairfield
        '1487640311580': Map({
            id:'1487640311580',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                'OAKLAND-Central',
                'SUI-Central'
            ]),
        }),
        // Fairfield to Sacramento
        '1487640317554': Map({
            id:'1487640317554',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                'SUI-Central',
                'SAC-Central'
            ]),
        }),
        // Sacramento to Truckee
        '1487640323386': Map({
            id:'1487640323386',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                'SAC-Central',
                'TRUCKEE-Central'
            ]),
        }),
    }),
    // The mode is for vehicle compatibility
    modes: Map({
        '1487639656930': Map({
            id:'1487639656930',
            label: 'high speed rail'
        }),
        '1487639664291': Map({
            id:'1487639664291',
            label: 'standard rail'
        }),
        '1487639673634': Map({
            id:'1487639673634',
            label: 'light rail'
        }),
        '1487639682173': Map({
            id:'1487639682173',
            label: 'standard gauge heavy rail (metro)'
        }),
        '1487639691538': Map({
            id:'1487639691538',
            label: 'Indian gauge heavy rail (metro)'
        })
    }),


    // Defines the start and end stops of transit service. Only enough waypoints are specified
    // to guarantee that the service matches the correct lines via minimum distance algorithm.
    services: Map({
        // Service from San Francisco to Sacramento (via Stockton)
        '1487637588201': Map({
            id: '1487637588201',
            stopStart: '1487637354681',
            wayPoints: List(['STOCKTON-Central']),
            stopEnd: 'SAC-Central',
        }),
        // Service from San Francisco to Sacramento (via Fairfield)
        '1487638239735': Map({
            id: '1487638239735',
            stopStart: '1487637354681',
            wayPoints: List(['SUI-Central']),
            stopEnd: 'SAC-Central',
        }),
        // Service from Sacramento to Reno, but only as far as Truckee
        '1487638047992': Map({
            id: '1487638047992',
            stopStart: 'SAC-Central',
            stopEnd: 'TRUCKEE-Central',
        }),
    }),
    mapBox: {
        viewport: {
            latitude: center.latitude,
            longitude: center.longitude,
            zoom: zoom,
            bearing: bearing,
            pitch: pitch,
            startDragLngLat: null,
            isDragging: false
        }
    }
})

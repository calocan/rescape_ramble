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
    routes: Map({
        'SF_Reno_via_North_Bay': Map({
            id: '1487725963417',
            routeShortName: 'CC1',
            routeLongName: 'San Francisco/Reno via North Bay',
            routeType: '103'
        }),
        'SF_Reno_via_Altamont_Pass': Map({
            id: '1487725974937',
            routeShortName: 'ACE1',
            routeLongName: 'San Francisco/Reno via Altamont Pass',
            routeType: '103'
        })
    }),

    trips: Map({
        '1487725901304': Map({
            id: '1487725901304',
            routeId: '1487725963417',
            serviceId: 'daily',
            directionId: '0',
            tripHeadsign: 'Reno via North Bay'
        }),
        '1487726056618': Map({
            id: '1487726056618',
            routeId: '1487725963417',
            serviceId: 'daily',
            directionId: '1',
            tripHeadsign: 'San Francisco via North Bay'
        }),
        '1487726084276': Map({
            id: '1487726084276',
            routeId: '1487725963417',
            serviceId: 'daily',
            directionId: '0',
            tripHeadsign: 'Reno via Altamont Pass'
        }),
        '1487726089940': Map({
            id: '1487726089940',
            routeId: '1487725963417',
            serviceId: 'daily',
            directionId: '1',
            tripHeadsign: 'San Francisco via Altamont Pass'
        }),
    }),

    // The stops of fixed guideway transit service. These are the nodes of the graph
    stops: Map({
        '1487636365510': Map({
            id: '1487636365510',
            label: 'Oakland Central Station',
            point: Map({
                lon: -122.277158,
                lat: 37.806624
            })
        }),
        '1487636173160': Map({
            id: '1487636173160',
            label: 'Stockton AMTRAK Station',
            point: Map({
                lon: -122.277158,
                lat: 37.806624
            })
        }),
        '1487636659567': Map({
            id: '1487636659567',
            label: 'Truckee AMTRAK Depot',
            point: Map({
                lon: -120.185620,
                lat: 39.327493
            })
        }),
        '1487637917789': Map({
            id: '1487637917789',
            label: 'Sacramento AMTRAK Station',
            point: Map({
                lon: -121.500675,
                lat: 38.584162
            })
        }),
        '1487638573082': Map({
            id: '1487638573082',
            label: 'San Francisco Transbay Terminal',
            point: Map({
                lon: -122.392481,
                lat: 37.789339
            })
        }),
        '1487639102048': Map({
            id: '1487639102048',
            label: 'Los Angeles Union Station',
            point: Map({
                lon: -118.236502,
                lat: 34.056219
            })
        }),
        '1487640034432': Map({
            id: '1487640034432',
            label: 'Pleasanton Station',
            point: Map({
                lon: -121.899181,
                lat: 37.701650
            })
        }),
        '1487640163858': Map({
            id: '1487640163858',
            label: 'Fairfield AMTRAK Station',
            point: Map({
                lon: -122.041192,
                lat: 38.243449
            })
        }),
    }),
    // The transit lines connecting each stop. These are the line segments of the graph
    lines: Map({
        // San Francisco to Oakland
        '1487639656930': Map({
            id:'1487639656930',
            mode: '1487639691538',
            tracks: 2,
            stopPair: Set([
                '1487638573082',
                '1487636365510'
            ]),
        }),
        // Oakland to Pleasanton
        '1487640291761': Map({
            id:'1487640291761',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                '1487636365510',
                '1487640034432'
            ]),
        }),
        // Pleasonton to Stockton
        '1487640299074': Map({
            id:'1487640299074',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                '1487640034432',
                '1487636173160'
            ]),
        }),
        // Stockton to Sacramento
        '1487640304649': Map({
            id:'1487640304649',
            mode: '1487639656930',
            tracks: 4,
            stopPair: Set([
                '1487636173160',
                '1487637917789'
            ]),
        }),
        // Oakland to Fairfield
        '1487640311580': Map({
            id:'1487640311580',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                '1487636365510',
                '1487640163858'
            ]),
        }),
        // Fairfield to Sacramento
        '1487640317554': Map({
            id:'1487640317554',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                '1487640163858',
                '1487637917789'
            ]),
        }),
        // Sacramento to Truckee
        '1487640323386': Map({
            id:'1487640323386',
            mode: '1487639691538',
            tracks: 3,
            stopPair: Set([
                '1487637917789',
                '1487636659567'
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
            wayPoints: List(['1487636173160']),
            stopEnd: '1487637917789',
        }),
        // Service from San Francisco to Sacramento (via Fairfield)
        '1487638239735': Map({
            id: '1487638239735',
            stopStart: '1487637354681',
            wayPoints: List(['1487640163858']),
            stopEnd: '1487637917789',
        }),
        // Service from Sacramento to Reno, but only as far as Truckee
        '1487638047992': Map({
            id: '1487638047992',
            stopStart: '1487637917789',
            stopEnd: '1487636659567',
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

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

import {OrderedMap, Map, List, Set} from 'immutable'

export default OrderedMap({

    travel: OrderedMap({
        current: '1487635143780',
        history: List([
            '1487635143780'
        ])
    }),
    trips: Map({
        entries: Map({
            trips: Map({
                // Trip from Oakland To Truckee via Stockton
                '1487635143780': Map({
                    id: '1487635143780',
                    locations: Map({
                        localStart: '1487636046449',
                        stationStart: '1487636365510',
                        wayPoints: List([
                            '1487636173160'
                        ]),
                        stationEnd: '1487636659567',
                        localEnd: '1487636978561'
                    }),
                    route: '1487637354681',
                }),
                // Trip from San Francisco to Los Angeles
                '1487638899977': Map({
                    id: '1487638899977',
                    locations: Map({
                        stationStart: '1487638573082',
                        stationEnd: '1487639102048',
                    }),
                    route: '1487637354681',
                })
            }),
        })
    }),
    // Defines the combinations of service that make a trip from stationStart to stationEnd
    routes: Map({
        // Route through Stockton
        '1487637354681': Map({
            id: '1487637354681',
            services: OrderedMap({
                // Service from San Francisco to Sacramento, but only the Oakland Sacramento portion
                '1487637588201': Map({
                    id: '1487637588201',
                    stationStart: '1487637354681',
                    stationEnd: '1487637917789',
                }),
                // Service from Sacramento to Reno, but only as far as Truckee
                '1487638047992': Map({
                    id: '1487638047992',
                    stationStart: '1487637917789',
                    stationEnd: '1487636659567',
                }),
            })
        }),
        // Route without Stockton
        '1487638173974': Map({
            id: '1487638173974',
            services: OrderedMap({
                // Service from San Francisco to Sacramento (via Fairfield), but only the Oakland Sacramento portion
                '1487638239735': Map({
                    id: '1487638239735',
                    stationStart: '1487637354681',
                    stationEnd: '1487637917789',
                }),
                // Service from Sacramento to Reno, but only as far as Truckee
                '1487638047992': Map({
                    id: '1487638047992',
                    stationStart: '1487637917789',
                    stationEnd: '1487636659567',
                }),
            })
        })
    }),
    locations: Map({
        '1487636046449': Map({
            searchTerm: '245 Montecito Ave, Oakland, CA',
            resolvedAddress: '245 Montecito Ave Oakland, CA 94610',
            label: 'Home',
            point: Map({
                lon: -122.258071,
                lat: 37.812885
            })
        }),
        '1487636978561': Map({
            searchTerm: 'Northstar Resort',
            resolvedAddress: 'Northstar California Resort, Northstar Drive, Truckee, CA',
            label: 'Skiing',
            point: Map({
                lon: -120.120605,
                lat: 39.274839
            })
        })
    }),
    // The stations of fixed guideway transit service. These are the nodes of the graph
    stations: Map({
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
    // The transit lines connecting each station. These are the line segments of the graph
    lines: Map({
        // San Francisco to Oakland
        '1487639656930': Map({
            id:'1487639656930',
            mode: '1487639691538',
            tracks: 2,
            stationPair: Set([
                '1487638573082',
                '1487636365510'
            ]),
        }),
        // Oakland to Pleasanton
        '1487640291761': Map({
            id:'1487640291761',
            mode: '1487639691538',
            tracks: 3,
            stationPair: Set([
                '1487636365510',
                '1487640034432'
            ]),
        }),
        // Pleasonton to Stockton
        '1487640299074': Map({
            id:'1487640299074',
            mode: '1487639691538',
            tracks: 3,
            stationPair: Set([
                '1487640034432',
                '1487636173160'
            ]),
        }),
        // Stockton to Sacramento
        '1487640304649': Map({
            id:'1487640304649',
            mode: '1487639656930',
            tracks: 4,
            stationPair: Set([
                '1487636173160',
                '1487637917789'
            ]),
        }),
        // Oakland to Fairfield
        '1487640311580': Map({
            id:'1487640311580',
            mode: '1487639691538',
            tracks: 3,
            stationPair: Set([
                '1487636365510',
                '1487640163858'
            ]),
        }),
        // Fairfield to Sacramento
        '1487640317554': Map({
            id:'1487640317554',
            mode: '1487639691538',
            tracks: 3,
            stationPair: Set([
                '1487640163858',
                '1487637917789'
            ]),
        }),
        // Sacramento to Truckee
        '1487640323386': Map({
            id:'1487640323386',
            mode: '1487639691538',
            tracks: 3,
            stationPair: Set([
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
    // Defines the start and end stations of transit service. Only enough waypoints are specified
    // to guarantee that the service matches the correct lines via minimum distance algorithm.
    services: Map({
        // Service from San Francisco to Sacramento (via Stockton)
        '1487637588201': Map({
            id: '1487637588201',
            stationStart: '1487637354681',
            wayPoints: List(['1487636173160']),
            stationEnd: '1487637917789',
        }),
        // Service from San Francisco to Sacramento (via Fairfield)
        '1487638239735': Map({
            id: '1487638239735',
            stationStart: '1487637354681',
            wayPoints: List(['1487640163858']),
            stationEnd: '1487637917789',
        }),
        // Service from Sacramento to Reno, but only as far as Truckee
        '1487638047992': Map({
            id: '1487638047992',
            stationStart: '1487637917789',
            stationEnd: '1487636659567',
        }),
    }),
    // Days and times of a unique sets of service, start station, end station, and intermediate stations.
    // Only the time of the start and end station need to be specified. intermediate station times are
    // calculated.
    schedule: Map({
        '': Map({
            id: '',
            service: '',
            // Daily
            days: null,
            stationStartInfo: Map({

            }),
            stationEndInfo: Map({

            }),
            intermediateStationInfo: Map({

            })
        })

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

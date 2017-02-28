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

import {OrderedMap, Map, List, Set, fromJS} from 'immutable';
import * as routeTypes from './routeTypes';
import journeys from './journeys.json';
import locations from './locations.json';
import routes from './routes';
import trips from './trips';
import stops from './stops';
import stopTimes from './stopTimes'
import {DEFAULT_SERVICE} from './services';
import {createService, stopTimeGenerator} from './dataCreationHelpers';
import {toImmutableKeyedByProp} from 'helpers/functions';
const toImmutableKeyedById = toImmutableKeyedByProp('id');

export default OrderedMap({

    // User journeys. not GTFS. This should always be seeded with an initial journey for demonstration purposes
    journeys: fromJS(journeys),
    // User locations, not GTSF. This should be seeded with whatever the journeys point to
    locations: fromJS(locations),

    // Defines service type. id is service_id in the GTFS specification
    // days are separate fields marked with 1 or 0
    calendar: toImmutableKeyedById({
        daily: DEFAULT_SERVICE,
        weekend: createService('20000101', '20991231', ['weekend'])
    }),

    // Mode/vehicle/service type keyed by id
    routeTypes: toImmutableKeyedById(routeTypes),

    // Nondirectional transit routes keyed by id
    routes: toImmutableKeyedById(routes),

    // Directional trips keyed by id
    trips: toImmutableKeyedById(trips),

    // The stops of fixed guideway transit service. These are the nodes of the graph
    stops: toImmutableKeyedById(stops),

    stopTimes: toImmutableKeyedById(stopTimes),

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

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

import {OrderedMap, fromJS} from 'immutable';
import R from 'ramda';

import {toImmutableKeyedByProp} from '../../helpers/functions';
const toImmutableKeyedById = toImmutableKeyedByProp('id');
export const toImmutableKeyedByGeneratedId = generator => R.pipe(
    R.map(item => R.merge(item, {id: generator.next().value})), // Add a generated id
    toImmutableKeyedByProp('id') // make the id the key
);

export const createInitialState = (config) => OrderedMap({

    settings: fromJS(config.settings),

    travel: Map({
        // User journeys. not GTFS. This should always be seeded with an initial journey for demonstration purposes
        journeys: toImmutableKeyedByGeneratedId(config.travel.journeys),
        // User locations, not GTSF. This should be seeded with whatever the journeys point to
        locations: toImmutableKeyedByGeneratedId(config.travel.locations),
    }),

    gtfs: {
        // Defines service type. id is service_id in the GTFS specification
        // days are separate fields marked with 1 or 0
        calendar: toImmutableKeyedById({
            daily: DEFAULT_SERVICE,
            weekend: WEEKEND_SERVICE
        }),

        // Mode/vehicle/service type keyed by id
        routeTypes: toImmutableKeyedById(routeTypes),

        // Nondirectional transit routes keyed by id
        routes: toImmutableKeyedById(routes),

        // Directional trips keyed by id
        trips: toImmutableKeyedById(trips),

        stops: toImmutableKeyedById(stops),
    },

    mapBox: {
        viewport: {
            latitude: config.center.latitude,
            longitude: config.center.longitude,
            zoom: config.zoom,
            bearing: config.bearing,
            pitch: config.pitch,
            startDragLngLat: null,
            isDragging: false
        }
    }
});

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

import {createRoute} from './dataCreationHelpers'
import {stopResolver} from './dataQueryHelpers'
import * as places from './places'
import * as regions from './regions'
import stops, * as w from './stops'
import * as routeTypes from './routeTypes'

const resolveStop = stopResolver(stops);
const routeType = routeTypes.INTER_REGIONAL_RAIL_SERVICE.id;

const sanFranciscoStop = resolveStop(places.SAN_FRANCISCO, w.TRANSBAY);
const renoStop = resolveStop(places.RENO, w.AMTRAK);
const losAngelesStop = resolveStop(places.LOS_ANGELES, w.UNION);

export default [
    createRoute(
        sanFranciscoStop,
        renoStop,
        {via: regions.NORTH_BAY,
        routeType}
    ),
    createRoute(
        sanFranciscoStop,
        renoStop,
        {via: regions.ALTAMONT,
        routeType}
    ),
    createRoute(
        sanFranciscoStop,
        losAngelesStop,
        {routeType}
    ),
];

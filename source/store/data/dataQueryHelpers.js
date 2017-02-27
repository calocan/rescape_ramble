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

import {createStopId, createRouteId} from 'dataCreationHelpers'
import {toImmutableKeyedByProp} from 'helpers/functions'

/***
 * Stop resolver for the given stops
 * @param {[Stop]} stops list of Stops
 * @returns {stopResolverCallback} - A function that takes a place.id and which
 */
export const stopResolver = stops => {
    const stopLookup = toImmutableKeyedByProp('id')(stops);
    return (place, which) => stopLookup.get(createStopId(place.id, which));
};

/**
 * This callback is displayed as part of the Requester class.
 * @callback stopResolverCallback
 * @param {Object} place Object defining the id
 * @param {string} place.id id of the place
 * @param {string} which which station of a place (e.g. Amtrak, Union, Airport)
 */

/***
 * Route resolver for the given stops
 * @param {[Route]} routes list of Routes
 * @returns {routeResolverCallback} - A function that takes a place.id and which
 */
export const routeResolver = routes => {
    const routeLookup = toImmutableKeyedByProp('id')(routes);
    return (from, to, via=null) => routeLookup.get(createRouteId(from, to, via))
};

/**
 * This callback is displayed as part of the Requester class.
 * @callback routeResolverCallback
 * @param {Stop} fromStop Either end of the Route
 * @param {Stop} toStop The other end of the Route
 * @param {string} [via] Optional Region string for Routes that distinguish by an intermediate Region
 */
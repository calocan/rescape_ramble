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

const orEmpty = ( entity ) => entity || "";
const compact = ( iter ) => filter(iter, item=>item);
const tripHeadSign = ( to, via ) => compact(to.label, via).join(' via ');
import {fromJS} from 'immutable'

/***
 * Forms a unique stop id based on the place id and which station/stop of that place it is
 * @param {string} id Place id
 * @param {string|null} [which] Which station/stop (e.g. Union, Airport)
 */
const createStopId = (id, which=null) => [compact([place, which]).join('-')];

/**
 * @typedef {Object} Location
 * @property {number} lon The longitude
 * @property {number} lat The latitude
**/


/**
 * @typedef {Object} Stop
 * @property {string} id The X Coordinate
 * @property {Place} place The Place of the Stop
 * @property {string} which Which Stop/Station of the Place (e.g. Central or Airport)
 * @property {stopName} place The Place of the Stop
 * @property {location} place The Place of the Stop
 */

/***
 * Creates a GTFS compatible stop definition
 * @param {Place} place An object representing a city or town
 * @param {string} place.id The 3 letter code of the city or town main station, based on train station codes
 * @param {string} place.label Label describing the place
 * @param {Location} location: lon/lat pair
 * @param {number} location.lon
 * @param {number} location.lat
 * @param {Object} [options]
 * @param {string|null} [options.which] Label representing the specific stop, such as 'Central', 'Arena', or 'Airport'
 * @param {string|null} [options.stopName] label describing the stop. Defaults to `${place}[ ${where}] ${stopType}`
 * @param {string|null} [options.stopType] label describing the stop type if stopName is not used, defaults to 'Station'
 * @returns {{}} A Stop object
 */
export const createStop = (place, location, options={}) => {
    const id = createStopId(place.id, options.which);
    return {
        id: id,
        place: place,
        which: options.which,
        stopName: options.stopName || `${place} ${options.which} ${options.stopType || 'Station'}`,
        location
    }
};

/***
 * Resolves the stop based on the given place name
 * @param {Object|Map} stops Object of Objects keyed by Stop id and valued by Stop
 * @param {Object|Map} place Object defining the id
 * @param {string} place.id id of the place
 * @param {string|null} [which] which station of a place (e.g. Amtrak, Union, Airport)
 * @returns {*}
 */
const resolveStop = (stops, place, which=null) => {
    return fromJS(stops).get(createStopId(place.id, which));
};

/***
 * Stop resolver for the given stops
 * @param stops
 * @returns {curriedResolveStop} - Returns resolveStop call with stops set
 */
export const stopResolver = stops => (place, which=null) => resolveStop(stops, place, which)

/**
 * resolveStop with curried stops
 * @callback curriedResolveStop
 * @param {Object|Map} place Object defining the id
 * @param {string} place.id id of the place
 * @param {string|null} [which] which station of a place (e.g. Amtrak, Union, Airport)
 */

/**
 * @typedef {Object} Route
 * @property {string} id The id of the Route
 * @property {[Stop]} stops The two end stops of the Route
 * @property {string} routeLongName The full name of the Route
 * @property {string} routeShortName The short name of the Route
 * @property {string} The id of the RouteType
 */

/***
 * Generates a non-directional Route between two stops. specs.via allows a distinguishing label for routes
 * that have the same two stops but use different tracks
 * @param {Object} from - 'From' Stop
 * @param {string} from.id - used for route id
 * @param {Object} to - 'To' Stop
 * @param {string} to.id - used for route id
 * @param {Object} specs - Mostly required additional values
 * @param {string} [specs.via] - Optional label of via region or city of the Route.
 * @param {string} specs.routeType - GTFS extended RouteType (see routes.json)
 * @returns {Route} An object representing the Route
 */
export const createRoute = (from, to, specs) => {
    const id = compact([from, to, orEmpty(specs.via)]).join('-');
    const routeLongName = compact([
        [from, to].join('/'),
        orEmpty(specs['via'])]).join(' via ');
    return {
        id: id,
        stops: {from, to},
        routeLongName,
        routeShortName,
        routeType: specs.routeType,
    }
};

/***
 * Generates a to and from trip definition for the given trip ids and other required specs
 * @param {Object} route.stops - object with Stops used for naming the tripHeadsigns
 * @param {Object} route.stops.from - used as the from Stop and the to stop for the reverse direction
 * @param {string} route.stops.from.id - used as part of the trip id
 * @param {string} route.stops.from.label - used for tripHeadSign in reverse direction
 * @param {Object} route.stops.to - used as the to Stop and the from stop for the reverse direction
 * @param {string} route.stops.to.id - used for reverse trip id
 * @param {string} route.stops.to.label - used for tripHeadSign
 * @param {Object} specs - Mostly required additional values
 * @param {string} [specs.via] - Optional label of via region or city of the trip.
 * @param {string} specs.serviceId - Id of the Service of the Trip
 * @returns [] A two-item array containing each of the Trips
 */
export const createTripPair = (route, specs) => {
    const createTrip = (from, to, directionId) => {
        const id = compact([
            route.stops.from.id,
            route.stops.to.id,
            orEmpty(specs.via)]
        ).join('-');

        return {
            id: id,
            routeId: route.id,
            serviceId: specs.serviceId,
            directionId: directionId,
            tripHeadsign: tripHeadSign(to, specs.via)
        }
    }
    return [
        createTrip(route.stops.from, route.stops.to, '0'),
        createTrip(route.stops.to, route.stops.from, '1'),
    ]
};
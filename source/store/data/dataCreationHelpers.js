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
const compact = ( iter ) => filter(iter, item=>item)
const tripHeadSign = ( to, via ) => compact(to.label, via).join(' via ')

/***
 * Creates a GTFS compatible stop definition
 * @param {Object} place An object representing a city or town
 * @param {string} place.id The 3 letter code of the city or town main station, based on Amtraks's codes
 * @param {string} place.label Label describing the place
 * @param {Object} location: lon/lat pair
 * @param {number} location.lon
 * @param {number} location.lat
 * @param {Object} options
 * @param {string|null} [options.where] Label representing the specific stop, such as 'Central', 'Arena', or 'Airport'
 * @param {string|null} [options.stopName] label describing the stop. Defaults to `${place}[ ${where}] ${stopType}`
 * @param {string|null} [options.stopType] label describing the stop type if stopName is not used, defaults to 'Station'
 * @returns {{}} Single item object keyed by id and valued by a stop
 */
export const createStop = (place, location, where, options) => {
    const id = [compact([place, options.where]).join('-')]
    return {
        [id]: {
            id: id,
            stopName: options.stopName || `${place} ${options.where} ${options.stopType || 'Station'}`,
            location
        }
    }
}

/***
 * Generates a to and from trip definition for the given trip ids and other required specs
 * @param {Object} from - From station, used as to station for reverse direction
 * @param {string} from.id - used for trip id
 * @param {string} from.label - used for tripHeadSign in reverse direction
 * @param {Object} to - to station, used as from station for reverse direction
 * @param {string} to.id - used for reverse trip id
 * @param {string} to.label - used for tripHeadSign
 * @param {Object} specs - Mostly required additional values
 * @param {string} [specs.via] - Optional label of via region or city of the trip.
 * @param {string} specs.routeId - Optional label of via region or city of the trip.
 * @returns {{}} A two item object for the to and from trips
 */
export const createTripPair = (from, to, specs) => {
    const id = compact([from, to, orEmpty(specs['via'])]).join('-')
    const reverseId = compact([to, from, orEmpty(specs['via'])]).join('-')
    return {
        [id]: Map({
            id: id,
            routeId: specs.routeId,
            serviceId: specs.serviceId,
            directionId: spects.directionId,
            tripHeadsign: tripHeadSign(to, specs[via])
        }),
        [reverseId]: Map({
            id: reverseId,
            routeId: specs.routeId,
            serviceId: specs.serviceId,
            directionId: spects.directionId,
            tripHeadsign: tripHeadSign(to, specs[via])
        }),
    }
}
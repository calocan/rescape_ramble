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

import {fromJS, Map, List} from 'immutable'
const orEmpty = ( entity ) => entity || "";
const filterWith = function * (fn, iterable) {
    for (const element of iterable) {
        if (!!fn(element)) yield element;
    }
}
/***
 * Removed non-truthy items from an iterable
 * @param {Iterable} iterable that might have non truthy values to remove
 * @returns {Iterable} an iterable that filters out non truthy items
 */
const compact = filterWith(item => item);

/***
 * Convert the obj to an Immutable if it is not.
 * @param obj
 */
const toImmutable = ( obj ) => Iterable.isIterable(obj) ? obj : fromJS(obj);
/***
 * If listOrObj is not an object, this converts it to an array to an object keyed by each array items id.
 * @param listOrObj
 * @returns {*|Map<K, V>|Map<string, V>}
 */
export const keyById = listOrObj => {
    const resolved = toImmutable(listOrObj);
    return Map.isMap(resolved) ? resolved : Map(resolved.map(item => [item.key, item]));
}

const tripHeadSign = ( to, via ) => compact([to.label, via]).join(' via ');

/***
 * Forms a unique stop id based on the place id and which station/stop of that place it is
 * @param {string} id Place id
 * @param {string|null} [which] Which station/stop (e.g. Union, Airport)
 * @returns {string} A stop id
 */
const createStopId = (id, which=null) => compact([place, which]).join('-');

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
 * @property {stopName} the name of the Stop
 * @property {Location} the lon/lat of the Stop
 */

/***
 * Creates a GTFS compatible stop definition
 * @param {Place} place An object representing a city or town
 * @param {string} place.id The 3 letter code of the city or town main station, based on train station codes
 * @param {string} place.label Label describing the place
 * @param {string} which Label representing the specific stop, such as 'Amtrak', 'Central', 'Arena', or 'Airport'.
 * @param {Location} location: lon/lat pair
 * @param {number} location.lon
 * @param {number} location.lat
 * @param {Object} [options]
 * @param {string|null} [options.stopName] label describing the stop. Defaults to `${place}[ ${where}] ${stopType}`
 * @param {string|null} [options.stopType] label describing the stop type if stopName is not used, defaults to 'Station'
 * @returns {Map} A Stop object
 */
export const createStop = (place, which, location, options={}) => {
    const id = createStopId(place.id, which);
    return fromJS({
        id: id,
        place: place,
        which: which,
        stopName: options.stopName || `${place} ${which} ${options.stopType || 'Station'}`,
        location
    })
};



/***
 * Resolves the stop based on the given place name
 * @param {List|Object} stops List of Stops or Object of Objects keyed by Stop id and valued by Stop
 * @param {Object} place Object defining the id
 * @param {string} place.id id of the place
 * @param {string|null} [which] which station of a place (e.g. Amtrak, Union, Airport)
 * @returns {*}
 */
const resolveStop = (stops, place, which=null) => {
    const stopLookup = keyById(stops)
    return toImmutable(stops).get(createStopId(place.id, which));
};

/***
 * Stop resolver for the given stops
 * @param stops
 * @returns {curriedResolveStop} - Returns resolveStop call with stops set
 */
export const stopResolver = stops => (place, which=null) => resolveStop(stops, place, which);

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
 * @property {Object} stops The two end stops of the Route
 * @property {string} routeLongName The full name of the Route
 * @property {string} routeShortName The short name of the Route
 * @property {string} routeType The id of the RouteType
 */

/***
 * Generates a non-directional Route between two stops. specs.via allows a distinguishing label for routes
 * that have the same two stops but use different tracks
 * @param {Stop} from - 'From' Stop
 * @param {Place} from.place - the general place of the Stop
 * @param {string} from.place.id - used for route id
 * @param {string} from.place.label - used for route long name
 * @param {Stop} to - 'To' Stop
 * @param {Place} to.place - the general place of the Stop
 * @param {string} to.place.id - used for route id
 * @param {string} to.place.label - used for route long name
 * @param {Object} specs - Mostly required additional values
 * @param {string} [specs.via] - Optional label of via region or city of the Route.
 * @param {string} specs.routeType - GTFS extended RouteType (see routes.json)
 * @returns {Route} An object representing the Route
 */
export const createRoute = (from, to, specs) => {
    // The id is from the place ids with an optional via
    // (e.g. 'SFC-REN via Altamont')
    const id = compact([
        [
            from.place.id,
            to.place.id
        ].join('-'),
        orEmpty(specs.via)
    ]).join(' via ');

    // Made from the from and to stop names and the optional specs.via
    // (e.g. 'San Francisco/Reno via Altamont
    const routeLongName = compact([
        [from.place.label, to.place.label].join('/'),
        orEmpty(specs['via'])]).join(' via ');
    // Made from the route type and id
    // (e.g. 'IRRS SFC-REN via Altamont' for inter regional rail service between SFC and RENO via Altamont
    const routeShortName = compact([id, orEmpty(specs['via'])]).join(' via ');
    return {
        id: id,
        stops: {from, to},
        routeLongName,
        routeShortName,
        routeType: specs.routeType,
    }
};

export const resolveRoute = (routes, from, to, via=null) => {

}

/**
 * @typedef {Object} Service
 * @property {string} id The id of the Service
 * @property {[string]} days Days of service
 * @property {[string]} seasons Seasons of service
 */

/***
 * Creates a Service is based on the given days and season. In the GTSF spec this file is calendar
 * @param {string} startDate. The startDate of the service in the form YYYYMMDD
 * @param {string} endDate. The endDate of the service in the form YYYYMMDD
 * @param {[string]} [days]. Default ['everyday'] Days of the week, 'everyday', 'weekday', 'weekend', 'blue moons', etc
 * @param {[string]} [seasons]. Default ['yearlong'] Seasons of the year: 'Winter', 'School Year', 'Tourist Season'
 * @returns {Service} A Service object with an id based on days and seasons
 */
export const createService = (startDate, endDate, days=['everyday'], seasons=['yearlong']) => {
    return {
        id: [...seasons, ...days].join('_'),
        days,
        seasons,
        startDate,
        endDate
    }
};

/***
 * Generates a to and from trip definition for the given trip ids and other required specs
 * @param {Route} route - the Route used by the trip
 * @param {Object} route.stops - object with Stops used for naming the tripHeadsigns
 * @param {Stop} route.stops.from - used as the from Stop and the to stop for the reverse direction
 * @param {Place} route.stops.from.place - the general place of the Stop
 * @param {string} route.stops.from.place.id - used for trip id
 * @param {string} route.stops.from.place.label - used for the tripHeadSign
 * @param {Stop} route.stops.to - used as the to Stop and the from stop for the reverse direction
 * @param {Place} route.stops.to.place - the general place of the Stop
 * @param {string} route.stops.to.place.id - used for trip id
 * @param {string} route.stops.to.place.label - used for the tripHeadSign
 * @param {Object} specs - Mostly required additional values
 * @param {string} [specs.via] - Optional label of via region or city of the trip.
 * @param {string} specs.serviceId - Id of the Service of the Trip
 * @returns [] A two-item array containing each of the Trips
 */
export const createTripPair = (route, specs) => {
    const createTrip = (from, to, directionId) => {
        const id = compact([
            [
                route.stops.from.place.id,
                route.stops.to.place.id
            ].join('-'),
            orEmpty(specs.via)]).join(' via ');

        return {
            id: id,
            routeId: route.id,
            serviceId: specs.serviceId,
            directionId: directionId,
            tripHeadsign: tripHeadSign(to, specs.via)
        }
    };
    // Create a trip for each direction
    return [
        createTrip(route.stops.from, route.stops.to, '0'),
        createTrip(route.stops.to, route.stops.from, '1'),
    ];
};

/**
 * @typedef {Object} StopTime
 * @property {string} tripId The id of the Trip
 * @property {string} stopSequence The stop number in sequence (e.g. 1 is the first stop, 2 the second stop)
 * @property {string} arrivalTime The arrival time in format 23:59:59
 * @property {string} departureTime The departure time in format 23:59:59
 */

/***
 * Creates A StopTime
 * @param {string} tripId The Trip id
 * @param {number} stopSequence The stop number, 1 based
 * @param {string} stopId The Stop id
 * @param {string} arrivalTime The arrival time in format 23:59:59
 * @param {string} departureTime The departure time in format 23:59:59
 * @returns {StopTime}
 */
export const createStopTime = (tripId, stopSequence, stopId, arrivalTime, departureTime) => {
    return {
        tripId,
        stopSequence,
        stopId,
        arrivalTime,
        departureTime
    }
};

/***
 * Creates a StopTime generator. The generator uses the startTime and EndTime to
 * estimate where each Stop is based on the location of each Stop
 * @param {[Stop]} stops: A Stop object, optionally augmented with an arrivalTime and/or dwellTime
 * Adding the arrivalTime causes all stations up to that Stop to be estimated based on that time
 * and that of the startTime or last explicit arrivalTime+dwellTime. Adding the dwellTime adjusts
 * the dwellTime of just that Stop
 * @param {string} startTime Time of departure of trip in format 23:59:59.
 * @param {string} endTime Time of arrival of trip in format 23:59:59. If it surpasses 23:59:59, uses
 * 24 + time for arrival the next day, 48 + time for arrival the subsequent day, etc.
 * (According to https://developers.google.com/transit/gtfs/reference/stop_times-file)
 * @param {number} dwellTime Number of seconds of dwell time
 */
export const stopTimeGenerator = function * (tripId, stops, startTime, endTime, dwellTime) => {
    const date = new Date()

    const parseTimeToGenericDate = (time, dwellTime=0) => {
        const timeSegments = time.split(':').map(t => parseInt(t));
        new Date(2000,1,1, ...timeSegments.slice(2), timeSegments[3] + dwellTime);
    };
    const toTimeString = (departureDate, arrivalDate) => {
        return [
            (departureDate.getDate() - arrivalDate.getDate()) * 24 + date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ].join(':');
    };
    // http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    /***
     * Returns kilometers between location
     * @param fromLocation
     * @param toLocation
     * @returns {number}
     */
    function calculateDistance(fromLocation, toLocation) {
        const pi = Math.PI / 180,
            cos = Math.cos,
            a = 0.5 - cos((toLocation.lat - fromLocation.lat) * pi)/2 +
            cos(fromLocation.lat * pi) * cos(toLocation.lat * pi) *
            (1 - cos((toLocation.lon - fromLocation.lon) * pi))/2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; Earth Radius = 6371 km
    }

    /***
     * Given the previous StopTime, use its departureTime, the endTime, and the
     * percent distance of Stop between the previous Stop and the final Stop
     *
     * @param {Location} previousStopTime.stop.location
     * @param {Stop} stop
     * @param {string} stop.arrivalTime Optional augmentation to Stop which is
     * @param {Location} stop.location Used with previousStopTime.stop.location and endTime
     * to calculate what percentage to the end this location is
     * @param {StopTime|null} [previousStopTime] The previous StopTime. If there is none then
     * then we return the startTime, meaning it's the start of the line
     * returned immediately if it exists
     * @returns {string} The calculated arrival time or that given in stop.arrivalTime
     */
    const calculateArrivalTime = (stop, previousStopTime=null) => {
        if (stop.arrivalTime)
            return stop.arrivalTime;
        const remainingStops = stops.slice(stops.indexOf(stop));
        const distanceFromPreviousStop = calculateDistance(previousStopTime.stop.location, stop.location);
        // Starting with the disntance from previousStop, calcuate the total distance to the end
        const totalRemainingDistance = remainingStops.reduce((distance, currentStop) => {
            return distance + calculateDistance(
                stops[stops.indexOf(currentStop) -1].location,
                currentStop.location)
        }, distanceFromPreviousStop);
        // Calculate the fraction of distance to stop over the totalRemainingDistance
        const distanceFraction = distanceFromPreviousStop / totalRemainingDistance;
        const totalRemainingTime =
            parseTimeToGenericDate(endTime).getTime() -
            parseTimeToGenericDate(previousStopTime).getTime();
        // Take the fraction of total remaining time to calculate the arrivalTime
        return toTimeString(new Date(totalRemainingTime * distanceFraction))
    };

    /***
     * Calculates the departure time based on the arrivalTime and dwellTime
     * @param {string} arrivalTime Stop arrival time in format 23:59:59
     * @param {number} dwellTime Number of seconds of dwellTime
     * @returns {string}
     */
    const calculateDepartureTime = (arrivalTime, dwellTime) => {
        const arrivalDate =  parseTimeToGenericDate(time);
        const departureDate = parseTimeToGenericDate(time, dwellTime);
        // Returns the departureDate time, possibly adding multiples of 24 to the hours if the
        // departureDate is the next day (hopefully never more than that!)
        return toTimeString(departureDate, arrivalDate)
    }

    return stops.reduce((previousStopTime, stop, index) => {
        // Calculate the arrivalTime of the next stop based on distance or stop.arrivalTime.
        // If there is no previousStopTime it returns startTime
        const arrivalTime = calculateArrivalTime(stop, previousStopTime);
        yield(createStopTime(
            tripId,
            index + 1,
            stop.id,
            arrivalTime,
            calculateDepartureTime(arrivalTime, stop.dwellTime || dwellTime)
        ));
    })
};

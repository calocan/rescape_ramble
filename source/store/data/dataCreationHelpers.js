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

import {compact, orEmpty} from 'helpers/functions';

// Direction ids for typical Trip pairs
const FROM_TO_DIRECTION = '0';
const TO_FROM_DIRECTION = '1';

const tripHeadSign = ( to, via ) => compact([to.label, via]).join(' via ');

/***
 * Forms a unique stop id based on the place id and which station/stop of that place it is
 * @param {string} placeId Place id
 * @param {string|null} [which] Which station/stop (e.g. Union, Airport)
 * @returns {string} A stop id
 */
export const createStopId = (placeId, which = null) => compact([placeId, which]).join('-');

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
export const createStop = (place, which, location, options = {}) => {
    const id = createStopId(place.id, which);
    return {
        id: id,
        place: place,
        which: which,
        stopName: options.stopName || `${place} ${which} ${options.stopType || 'Station'}`,
        location
    };
};

/**
 * @typedef {Object} Route
 * @property {string} id The id of the Route
 * @property {[Place]} places The two end Places of the Route
 * @property {string} routeLongName The full name of the Route
 * @property {string} routeShortName The short name of the Route
 * @property {string} routeType The id of the RouteType
 */

/***
 * Forms a unique Route id based on the place id and which station/stop of that place it is.
 * @param {Place} from The start/end Place
 * @param {Place} to The other start/end Place
 * @param {string} [via] Optional pass through Region to distinguish the route
 * @returns {string} A Route id
 */
export const createRouteId = (from, to, via) => {
    return compact([
        [
            from.place.id,
            to.place.id
        ].join('-'),
        orEmpty(via)
    ]).join(' via ');
};

/***
 * Generates a non-directional Route between two stops. specs.via allows a distinguishing label for routes
 * that have the same two stops but use different tracks
 * @param {Place} from - the general Place of one end of the Route
 * @param {string} from.id - used for route id
 * @param {string} from.label - used for route long name
 * @param {Place} to - the general Place of one end of the Route
 * @param {string} to.id - used for route id
 * @param {string} to.label - used for route long name
 * @param {Object} specs - Mostly required additional values
 * @param {string} [specs.via] - Optional label of via region or city of the Route.
 * @param {string} specs.routeType - GTFS extended RouteType (see routes.json)
 * @returns {Route} An object representing the Route
 */
export const createRoute = (from, to, specs) => {
    // The id is from the place ids with an optional via
    // (e.g. 'SFC-REN via Altamont')
    const id = createRouteId(from, to, specs.via);

    // Made from the from and to stop names and the optional specs.via
    // (e.g. 'San Francisco/Reno via Altamont
    const routeLongName = compact([
        [from.label, to.label].join('/'),
        orEmpty(specs.via)]).join(' via ');
    // Made from the route type and id
    // (e.g. 'IRRS SFC-REN via Altamont' for inter regional rail service between SFC and RENO via Altamont
    const routeShortName = compact([id, orEmpty(specs.via)]).join(' via ');
    return {
        id: id,
        places: {from, to},
        routeLongName,
        routeShortName,
        routeType: specs.routeType,
    }
};

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
export const createService = (startDate, endDate, days = ['everyday'], seasons = ['yearlong']) => {
    return {
        id: [...seasons, ...days].join('_'),
        days,
        seasons,
        startDate,
        endDate
    }
};

/***
 * Creates a Trip id
 * @param {Route} route The Route of the Trip
 * @param {int} directionId The direction id for the Trip (from -> to vs to -> from)
 * @param {Service} service The Service of the Trip
 */
export const createTripId = (route, directionId, service ) => {
    return [
        route.id,
        directionId,
        service.id
    ].join('-');
};

/**
 * @typedef {Object} Trip
 * @property {Route} route The Route of the Trip
 * @property {Stop} from The from Stop
 * @property {Place} from.place The Place of the Stop, used for the Route id
 * @property {Stop} to The to Stop
 * @property {Place} to.place The Place of the Stop, used for the Route id
 * @property {number} directionId The directionId of the Trip
 * @property {Service} service The Service of the Trip
 */

/**
 * @typedef {Object} TripWithStopTimes
 * @property {Route} route The Route of the Trip
 * @property {Stop} from The from Stop
 * @property {Place} from.place The Place of the Stop, used for the Route id
 * @property {Stop} to The to Stop
 * @property {Place} to.place The Place of the Stop, used for the Route id
 * @property {number} directionId The directionId of the Trip
 * @property {Service} service The Service of the Trip
 * @property {[StopTime]} StopTimes for the Trip
 */

/***
 * @property {Route} route The Route of the Trip
 * @property {Stop} from The from Stop
 * @property {Place} from.place The Place of the Stop, used for the Route id
 * @property {Stop} to The to Stop
 * @property {Place} to.place The Place of the Stop, used for the Route id
 * @property {number} directionId The directionId of the Trip
 * @property {Service} service The Service of the Trip
 * @returns {{id, route: *, service: *, directionId: *, tripHeadsign}}
 */
const createTrip = (route, from, to, directionId, service) => {
    const id = createTripId(route, from.place, to.place);

    return {
        id: id,
        route: route,
        service: service,
        directionId: directionId,
        tripHeadsign: tripHeadSign(to, route.via)
    }
};

/**
 * @callback stopTimeCallback
 * @param {Trip} trip The Trip
 * @returns {[Trip]} The Trip augmented with StopTimes
 */

/***
 * Generates a to and from trip definition for the given trip ids and other required specs
 * @param {Route} route - the Route used by the trip
 * @param {Object} route.stops - object with Stops used for naming the tripHeadsigns
 * @param {Place} route.places.from - The Place at one end of the Route
 * @param {string} route.places.from.label - used for the tripHeadSign
 * @param {Place} route.places.to - The Place at the other end of the Route
 * @param {string} route.places.to.id - used for trip id
 * @param {string} route.places.to.label - used for the tripHeadSign
 * @param {string} [route.via] Optional label of via region or city of the trip
 * @param {Service} service - The Service of the Trip
 * @param {stopTimeCallback} stopTimeCallback - Called with each trip to generate StopTimes.
 * This is
 * @returns [TripWithStopTimes] A two-item array containing with each result of stopTimeCallback.
 */
export const createTripWithStopTimesPair = (route, service, stopTimeCallback) =>
    [
        createTrip(route, route.stops.from, route.stops.to, FROM_TO_DIRECTION, service),
        createTrip(route, route.stops.to, route.stops.from, TO_FROM_DIRECTION, service)
    ].map(trip => Object.assign(trip, {stopTimes: stopTimeCallback(trip)}));

/**
 * @typedef {Object} StopTime
 * @property {string} tripId The id of the Trip
 * @property {string} stopSequence The stop number in sequence (e.g. 1 is the first stop, 2 the second stop)
 * @property {string} arrivalTime The arrival time in format 23:59:59
 * @property {string} departureTime The departure time in format 23:59:59
 */

/***
 * Creates A StopTime
 * @param {Trip} trip The Trip
 * @param {number} stopSequence The stop number, 1 based
 * @param {Stop} stop The Stop
 * @param {string} arrivalTime The arrival time in format 23:59:59
 * @param {string} departureTime The departure time in format 23:59:59
 * @returns {StopTime}
 */
export const createStopTime = (trip, stopSequence, stop, arrivalTime, departureTime) => {
    return {
        trip,
        stopSequence,
        stop,
        arrivalTime,
        departureTime
    };
};

/***
 * Returns the standard ordering for stops. If the trip directionId == '0', stops are returned in order.
 * If the trip directionId == TO_FROM_DIRECTION, stops are returned in reverse. A different function could be used
 * if the stops were not consistent for both directions of the trip
 * @param trip
 * @param stops
 */
export const orderStops = (trip, stops) => {
    switch (trip.directionId) {
        case FROM_TO_DIRECTION:
            return stops
        case TO_FROM_DIRECTION:
            return stops.reverse();
        default:
            throw new Error(`Unknown direction id ${trip.directionId}`);
    }
};

/***
 * Creates a StopTime generator. The generator uses the startTime and EndTime to
 * estimate where each Stop is based on the location of each Stop
 * @param {Trip} trip: A Trip to which the stopTimes apply
 * @param {string} trip.id: The id of the Trip
 * @param {[Stop]} stops: A Stop, optionally augmented with an arrivalTime and/or dwellTime
 * Adding the arrivalTime causes all stations up to that Stop to be estimated based on that time
 * and that of the startTime or last explicit arrivalTime+dwellTime. Adding the dwellTime adjusts
 * the dwellTime of just that Stop
 * @param {string} startTime Time of departure of trip in format 23:59:59.
 * @param {string} endTime Time of arrival of trip in format 23:59:59. If it surpasses 23:59:59, uses
 * 24 + time for arrival the next day, 48 + time for arrival the subsequent day, etc.
 * (According to https://developers.google.com/transit/gtfs/reference/stop_times-file)
 * @param {number} dwellTime Number of seconds of dwell time
 */
export const stopTimeGenerator = function* (trip, stops, startTime, endTime, dwellTime) {
    const date = new Date();

    const parseTimeToGenericDate = (time, customDwellTime = dwellTime) => {
        const timeSegments = time.split(':').map(t => parseInt(t));
        return new Date(2000, 1, 1, ...timeSegments.slice(2), timeSegments[3] + customDwellTime);
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
            a = 0.5 - cos((toLocation.lat - fromLocation.lat) * pi) / 2 +
            cos(fromLocation.lat * pi) * cos(toLocation.lat * pi) *
            (1 - cos((toLocation.lon - fromLocation.lon) * pi)) / 2;

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
    const calculateArrivalTime = (stop, previousStopTime = null) => {
        if (stop.arrivalTime) {
            return stop.arrivalTime;
        }
        const remainingStops = stops.slice(stops.indexOf(stop));
        const distanceFromPreviousStop = calculateDistance(previousStopTime.stop.location, stop.location);
        // Starting with the disntance from previousStop, calcuate the total distance to the end
        const totalRemainingDistance = remainingStops.reduce((distance, currentStop) => {
            return distance + calculateDistance(
                stops[stops.indexOf(currentStop) - 1].location,
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
    const calculateDepartureTime = (arrivalTime, customDwellTime = dwellTime) => {
        const arrivalDate = parseTimeToGenericDate(arrivalTime);
        const departureDate = parseTimeToGenericDate(arrivalTime, customDwellTime);
        // Returns the departureDate time, possibly adding multiples of 24 to the hours if the
        // departureDate is the next day (hopefully never more than that!)
        return toTimeString(departureDate, arrivalDate)
    }

    yield* stops.reduce((previousStopTime, stop, index) => {
        // Calculate the arrivalTime of the next stop based on distance or stop.arrivalTime.
        // If there is no previousStopTime it returns startTime
        const arrivalTime = calculateArrivalTime(stop, previousStopTime);
        return createStopTime(
            trip,
            index + 1,
            stop,
            arrivalTime,
            calculateDepartureTime(arrivalTime, stop.dwellTime || dwellTime)
        );
    });
};

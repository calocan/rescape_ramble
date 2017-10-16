/**
 * Created by Andy Likuski on 2017.02.23
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const moment = require('moment');
const {
    capitalize,
    compact,
    compactJoin,
    emptyToNull,
    idOrIdFromObj,
    reduceWithNext
} = require('rescape-ramda');
const {fromImmutable} = require('helpers/immutableHelpers');
const {toTimeString} = require('helpers/timeHelpers');
const {calculateDistance} = require('helpers/geospatialHelpers');

// Direction ids for typical Trip pairs
const FROM_TO_DIRECTION = module.exports.FROM_TO_DIRECTION = {
    id: '0',
    resolveToStop: route => route.places.to,
    resolveTripSymbol: route => `${route.places.from.id}->${route.via ? `(${route.via})->` : ''}${route.places.to.id}`
};
const TO_FROM_DIRECTION = module.exports.TO_FROM_DIRECTION = {
    id: '1',
    resolveToStop: route => route.places.from,
    resolveTripSymbol: route => `${route.places.to.id}->${route.via ? `(${route.via})->` : ''}${route.places.from.id}`
};

const tripHeadSign = (to, via) =>
    compact([to.label, via]).join(' via ');

/**
 * Forms a unique stop id based on the place id and which station/stop of that place it is
 * @param {Place|id} place The Place object or its id
 * @param {string} place.id The id of the Place used to create the Stop id
 * @param {string|null} [which] Which station/stop (e.g. Union, Airport)
 * @returns {string} A stop id
 */
const createStopId = module.exports.createStopId = (place, which = null) => compact([idOrIdFromObj(place), which]).join('-');

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

/**
 * Creates a GTFS compatible stop definition
 * @param {Place} place Place object representing a city or town
 * @param {string} place.id The 3 letter code of the city or town main station, based on train station codes
 * @param {string} place.label Label describing the place
 * @param {string} which Label representing the specific stop, such as 'Amtrak', 'Central', 'Arena', or 'Airport'.
 * @param {Location} location: lon/lat pair
 * @param {number} location.lon The longitude
 * @param {number} location.lat The latitude
 * @param {Object} [options] Options
 * @param {string|null} [options.stopName] label describing the stop. Defaults to `${place}[ ${where}] ${stopType}`
 * @param {string|null} [options.stopType] label describing the stop type if stopName is not used, defaults to 'Station'
 * @returns {Map} A Stop object
 */
const createStop = module.exports.createStop = (place, which, location, options = {}) => {
    const id = createStopId(place, which);
    return {
        id: id,
        place: place,
        which: which,
        stopName: options.stopName || `${place.label} ${which} ${options.stopType || 'Station'}`,
        location
    };
};

/**
 * @
 * @property {string} id The id of the Route
 * @property {[Place]} places The two end Places of the Route
 * @property {string} routeLongName The full name of the Route
 * @property {string} routeShortName The short name of the Route
 * @property {string} routeType The id of the RouteType
 * @property {string} [via] The optional intermediate Region of the Route
 */

/**
 * Forms a unique Route id based on the place id and which station/stop of that place it is.
 * @param {Place|id} from The start/end Place or its id
 * @param {Place|id} to The other start/end Place or its id
 * @param {string} [via] Optional pass through Region to distinguish the route
 * @returns {string} A Route id
 */
const createRouteId = module.exports.createRouteId = (from, to, via) => {
    const fromId = idOrIdFromObj(from);
    const toId = idOrIdFromObj(to);
    return via ?
        `${ fromId }<-${ via }->${ toId }` :
        `${ fromId }<->${ toId }`;
};

/**
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
const createRoute = module.exports.createRoute = (from, to, specs = {}) => {
    // The id is from the place ids with an optional via
    // (e.g. 'SFC-REN via Altamont')
    const id = createRouteId(from, to, specs.via);

    // Made from the from and to stop names and the optional specs.via
    // (e.g. 'San Francisco/Reno via Altamont
    const routeLongName = compact([
        [from.label, to.label].join('/'),
        specs.via]).join(' via ');
    // Made from the route type and id
    // (e.g. 'IRRS SFC-REN via Altamont' for inter regional rail service between SFC and RENO via Altamont
    const routeShortName = compact([id, specs.via]).join(' via ');
    return {
        id: id,
        places: {from, to},
        via: specs.via,
        routeLongName,
        routeShortName,
        routeType: specs.routeType
    };
};

/**
 * @typedef {Object} Service
 * @property {string} id The id of the Service
 * @property {[string]} days Days of service
 * @property {[string]} seasons Seasons of service
 * @property {[string]} label Friendly label of based on the parameters
 */

/**
 * Creates a Service is based on the given days and season. In the GTSF spec this file is calendar
 * @param {string|null} startDate The startDate of the service in the form YYYYMMDD.
 * If null then the start date is the 'beginning of time'
 * @param {string|null} endDate The endDate of the service in the form YYYYMMDD
 * If null then the end date is the 'end of time'
 * @param {[string]} [days] Default ['everyday'] Days of the week, 'everyday', 'weekday', 'weekend', 'blue moons', etc
 * @param {[string]} [seasons] Default ['yearlong'] Seasons of the year: 'Winter', 'School Year', 'Tourist Season'
 * @returns {Service} A Service object with an id based on days and seasons
 */
const createService = module.exports.createService = (startDate, endDate, days = ['everyday'], seasons = ['yearlong']) => {
    return {
        id: [...seasons, ...days].join('_'),
        days,
        seasons,
        startDate,
        endDate,
        label:
            // '[startDate-endDate] Day, Day Season, Season'
            compactJoin(' ', [
                compactJoin('-', [startDate, endDate]),
                R.pipe(
                    R.map(
                        R.pipe(R.map(capitalize), R.join(', '), emptyToNull)
                    ),
                    R.join(' '),
                    emptyToNull
                )([days, seasons])
            ])
    };
};

/**
 * Creates a Trip id
 * @param {Route|String} route The Route or Route id of the Trip
 * @param {Direction} direction Direction or Direction id for the Trip (from -> to vs to -> from)
 * @param {callback} direction.resolveTripSymbol Takes the route to create a directional Trip symbol
 * (e.g. to->[(via)]->from or from->[(via)]->to
 * @param {Service|String} service The Service or Service id of the Trip
 * @returns {String} The trip id
 */
const createTripId = module.exports.createTripId = (route, direction, service) => {
    return [
        direction.resolveTripSymbol(route),
        service.label
    ].join(' ');
};

/**
 * @typedef {Object} Trip
 * @property {Route} route The Route of the Trip
 * @property {Stop} from The from Stop
 * @property {Place} from.place The Place of the Stop, used for the Route id
 * @property {Stop} to The to Stop
 * @property {Place} to.place The Place of the Stop, used for the Route id
 * @property {Direction} Direction or Direction id of the Trip
 * @property {Service} service The Service of the Trip
 */

/**
 * @typedef {Object} TripWithStopTimes
 * @property {Route} route The Route of the Trip
 * @property {Stop} from The from Stop
 * @property {Place} from.place The Place of the Stop, used for the Route id
 * @property {Stop} to The to Stop
 * @property {Place} to.place The Place of the Stop, used for the Route id
 * @property {Trip} directionId The Direction or Direction id of the Trip
 * @property {Service} service The Service of the Trip
 * @property {[StopTime]} StopTimes for the Trip
 */

/**
 * @callback resolveToStop
 * @param {Route} Route to resolve a Stop from
 * @returns {Stop} The to Stop of the Trip
 */

/**
 * @typedef {Object} Direction
 * @property {Number} id The Direction id
 * @property {resolveToStop} resolve Resolve the Route to the to Stop of the Trip
 */

/**
 * Creates a Trip
 * @param {Route} route The Route of the Trip
 * @param {Direction} direction The Direction of the Trip
 * @param {Service} service The Service of the Trip
 * @returns {Object} The Trip
 */
const createTrip = module.exports.createTrip = (route, direction, service) => {
    const id = createTripId(route, direction, service);

    return {
        id: id,
        route: route,
        service: service,
        direction: direction,
        tripHeadsign: tripHeadSign(direction.resolveToStop(route), route.via)
    };
};

/**
 * @callback stopTimeCallback
 * @param {Trip} trip The Trip
 * @returns {Trip} The Trip augmented with StopTimes
 */

/**
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
 * @returns {[TripWithStopTimes]} A two-item array containing with each result of stopTimeCallback.
 */
const createTripWithStopTimesPair = module.exports.createTripWithStopTimesPair = (route, service, stopTimeCallback) =>
    [
        createTrip(route, FROM_TO_DIRECTION, service),
        createTrip(route, TO_FROM_DIRECTION, service)
    ].map(trip => R.merge(trip, {stopTimes: stopTimeCallback(trip)}));

/**
 * @typedef {Object} StopTime
 * @property {string} tripId The id of the Trip
 * @property {string} stopSequence The stop number in sequence (e.g. 1 is the first stop, 2 the second stop)
 * @property {Stop} stop The Stop
 * @property {string} arrivalTime The arrival time in format 23:59[:59]
 * @property {string} departureTime The departure time in format 23:59[:59]
 */

/**
 * Creates A StopTime
 * @param {Trip} trip The Trip
 * @param {number} stopSequence The stop number, 1 based
 * @param {Stop} stop The Stop
 * @param {string|null} [arrivalTime] The optional arrival time in format 23:59:59
 * @param {string|null} [departureTime] The optional departure time in format 23:59:59
 * @returns {StopTime} The StopTime
 */
const createStopTime = module.exports.createStopTime = (trip, stopSequence, stop, arrivalTime = null, departureTime = null) => {
    return R.mergeAll([
        {
            trip,
            stopSequence,
            stop
        },
        compact({arrivalTime, departureTime})
    ]);
};

/**
 * Returns the standard ordering for stops. If the trip directionId == '0', stops are returned in order.
 * If the trip directionId == TO_FROM_DIRECTION, stops are returned in reverse. A different function could be used
 * if the stops were not consistent for both directions of the trip
 * @param {Trip} trip The Trip
 * @param {[Stop]} stops The Stops
 * @returns {[Stop]} The ordered Stops
 */
const orderStops = module.exports.orderStops = (trip, stops) => {
    switch (trip.direction) {
        case FROM_TO_DIRECTION:
            return stops;
        case TO_FROM_DIRECTION:
            return stops.reverse();
        default:
            throw new Error(`Unknown direction id ${trip.directionId}`);
    }
};

/**
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
 * @yields {StopTime} each Stop Time
 * @returns {StopTime} WTF eslint
 */
const stopTimeGenerator = module.exports.stopTimeGenerator = function *(trip, stops, startTime, endTime, dwellTime) {
    const imStops = fromImmutable(stops);
    // The duration of the endTime
    const endDuration = moment.duration(endTime);
    // The total distance between stops
    const totalDistance = reduceWithNext(
        (total, current, next) => total + calculateDistance(current.location, next.location),
        imStops,
        0
    );

    /**
     * Given the previous StopTime, use its departureTime, the endTime, and the
     * percent distance of Stop between the previous Stop and the final Stop
     *
     * @param {Stop} stop The Stop
     * @param {string} [stop.arrivalTime] Optional augmentation to Stop to give an explicit arrival time
     * Otherwise the arrivalTime is calculated
     * @param {Location} stop.location Used with previousStopTime.stop.location and endTime
     * to calculate what percentage to the end this location is
     * @param {StopTime} previousStopTime The previous StopTime.
     * @param {StopTime} previousStopTime.stop The previous StopTime Stop
     * @param {Location} previousStopTime.stop.location The previous StopTime Location
     * @param {string} previousStopTime.departureTime The timeString of the previous departure
     * @param {Number} previousStopTime.totalDistance The distance in km since the start of the trip
     * @param {Number} distanceFromPreviousStop The distance in km from the previous stop or 0 at the start
     * @returns {Duration} The calculated arrival Duration relative to 00:00:00
     */
    const calculateArrivalDuration = (stop, previousStopTime, distanceFromPreviousStop) => {
        if (stop.arrivalTime) {
            return stop.arrivalTime;
        }

        const totalRemainingDistance = totalDistance - (previousStopTime.totalDistance + distanceFromPreviousStop);
        // If there is no remaining distance we are at the last stop
        if (totalRemainingDistance === 0) {
            return moment.duration(endDuration);
        }

        // Calculate the fraction of distance to stop over the total remainingDistance
        const distanceFraction = distanceFromPreviousStop / totalRemainingDistance;
        const remainingDuration = moment.duration(endDuration).subtract(moment.duration(previousStopTime.departureTime));
        // Calculate the elapsed time as a percentage of the total distance and add it to the last departure time
        return moment.duration(previousStopTime.departureTime).add(
            moment.duration(remainingDuration.asMilliseconds() * distanceFraction)
        );
    };

    /**
     * Calculates the departure time based on the arrivalTime and dwellTime
     * @param {Duration} arrivalDuration Duration of the arrival time (relative to 00:00:00)
     * @param {number} [customDwellTime] Number of seconds of dwellTime. Defaults to dwellTime
     * @returns {Duration} The Duration of the departure time (relative to 00:00:00)
     */
    const calculateDepartureDuration = (arrivalDuration, customDwellTime = dwellTime) => {
        return moment.duration(arrivalDuration).add(customDwellTime, 's');
    };


    // Reduce the stops in order to combine the previousStopTime with the current Stop.
    // In the initial case the previousStopTime will be the first Stop, so it must be augmented
    // with the startTime
    yield* [
        [{stop: R.head(imStops), totalDistance: 0, departureTime: startTime}], ...R.tail(imStops)
    ].reduce((previousStopTimes, stop, index) => {
        const previousStopTime = R.last(previousStopTimes);
        const previousStop = previousStopTime.stop;
        const distanceFromPreviousStop = calculateDistance(previousStop.location, stop.location);

        // Calculate the arrivalTime of the next stop based on distance or stop.arrivalTime.
        const arrivalDuration = calculateArrivalDuration(stop, previousStopTime, distanceFromPreviousStop);
        return previousStopTimes.concat(R.merge(
            createStopTime(
                trip,
                index + 1,
                stop,
                toTimeString(arrivalDuration),
                toTimeString(arrivalDuration) === toTimeString(endDuration) ?
                    null :
                    toTimeString(calculateDepartureDuration(arrivalDuration, stop.dwellTime || dwellTime))
            ),
            { totalDistance: previousStopTime.totalDistance + distanceFromPreviousStop }
        ));
    });
};

/**
 * Invokes the stopTimeGenerator to get all Stops
 * @param {Array} args See stopTimeGenerator
 * @returns {[Stop]} All of the Stops
 */
const createStopsTimes = module.exports.createStopTimes = (...args) => Array.from(stopTimeGenerator(...args));

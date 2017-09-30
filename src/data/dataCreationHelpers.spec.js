
const places = require('./california/californiaPlaces');
const helper = require('./dataCreationHelpers');
const w = require('./california/californiaStops');
const regions = require('./california/californiaRegions');
const routeTypes = require('./default/routeTypes');
const {DEFAULT_SERVICE} = require('./default/services');
const query = require('./dataQueryHelpers');
const stopTypes = require('./default/stopTypes');

describe('Data Creation Helpers', () => {
    test('Creates a Stop id from a Place and Stop location', () => {
        expect(helper.createStopId(places.LOS_ANGELES, w.UNION)).toMatchSnapshot();
    });

    test('Creates a Stop', () => {
        expect(helper.createStop(
            places.LOS_ANGELES, w.UNION, {lon: -118.236502, lat: 34.056219}
        )).toMatchSnapshot();
        expect(helper.createStop(
            places.LOS_ANGELES, w.UNION, {lon: -118.236502, lat: 34.056219},
            {stopName: 'LA Fancy Station'}
        )).toMatchSnapshot();
        expect(helper.createStop(
            places.LOS_ANGELES, w.UNION, {lon: -118.236502, lat: 34.056219},
            {stopType: 'MegaStation'}
        )).toMatchSnapshot();
    });

    test('Creates a Route id', () => {
        expect(helper.createRouteId(places.LOS_ANGELES, places.RENO)).toMatchSnapshot();
        expect(helper.createRouteId(places.LOS_ANGELES, places.RENO, regions.EAST_BAY)).toMatchSnapshot();
    });

    test('Creates a Route', () => {
        expect(helper.createRoute(places.LOS_ANGELES, places.RENO,
            {routeType: routeTypes.INTER_REGIONAL_RAIL_SERVICE})).toMatchSnapshot();
        expect(helper.createRoute(places.LOS_ANGELES, places.RENO,
            {via: regions.EAST_BAY, routeType: routeTypes.REPLACEMENT_RAIL_SERVICE})).toMatchSnapshot();
    });

    test('Creates a Service', () => {
        expect(helper.createService('20170601', '20170831', ['weekend'], ['summer'])).toMatchSnapshot();
    });

    test('Creates a Trip id', () => {
        const route = helper.createRoute(places.LOS_ANGELES, places.RENO,
            {routeType: routeTypes.INTER_REGIONAL_RAIL_SERVICE});
        expect(helper.createTripId(route, helper.FROM_TO_DIRECTION, DEFAULT_SERVICE)).toMatchSnapshot();
    });

    test('Creates Trip', () => {
        const route = helper.createRoute(places.LOS_ANGELES, places.RENO,
            {routeType: routeTypes.INTER_REGIONAL_RAIL_SERVICE});
        expect(helper.createTrip(route, helper.FROM_TO_DIRECTION, DEFAULT_SERVICE)).toMatchSnapshot();
    });
});

describe('Trips with Stops', () => {
    const route = helper.createRoute(places.LOS_ANGELES, places.RENO,
        {routeType: routeTypes.INTER_REGIONAL_RAIL_SERVICE});
    const trip = helper.createTrip(route, helper.TO_FROM_DIRECTION, DEFAULT_SERVICE);
    const resolveStop = query.stopResolver([
        helper.createStop(places.LOS_ANGELES, w.UNION,
            { lon: -118.236502, lat: 34.056219 },
        ),
        helper.createStop(places.OAKLAND, w.CENTRAL,
            { lon: -122.277158, lat: 37.806624 },
        ),
        helper.createStop(places.RENO, w.AMTRAK,
            { lon: -122.041192, lat: 38.243449 }
        ),
        helper.createStop(places.SACRAMENTO, w.AMTRAK,
            { lon: -121.500675, lat: 38.584162 }
        ),
        helper.createStop(places.SAN_FRANCISCO, w.TRANSBAY,
            { lon: -122.392481, lat: 37.789339 },
            { stopType: stopTypes.TERMINAL }
        ),
        helper.createStop(places.STOCKTON, w.AMTRAK,
            { lon: -121.285602, lat: 37.945332 }
        ),
        helper.createStop(places.TRUCKEE, w.AMTRAK,
            { lon: -120.185620, lat: 39.327493 },
            { stopType: stopTypes.DEPOT }
        )
    ]);

    test('Orders Stops of a Trip', () => {
        expect(helper.orderStops(trip, [
            resolveStop(places.SAN_FRANCISCO, w.TRANSBAY),
            resolveStop(places.OAKLAND, w.CENTRAL),
            resolveStop(places.STOCKTON, w.AMTRAK),
            resolveStop(places.SACRAMENTO, w.AMTRAK),
            resolveStop(places.TRUCKEE, w.AMTRAK),
            resolveStop(places.RENO, w.AMTRAK)
        ])).toMatchSnapshot();
    });

    test('Creates Trips with Stop Times Pair', () => {
        expect(helper.createTripWithStopTimesPair(route, DEFAULT_SERVICE,
            oneTrip => {
                return helper.createStopTimes(
                    oneTrip,
                    helper.orderStops(oneTrip, [
                        resolveStop(places.SAN_FRANCISCO, w.TRANSBAY),
                        resolveStop(places.OAKLAND, w.CENTRAL),
                        resolveStop(places.STOCKTON, w.AMTRAK),
                        resolveStop(places.SACRAMENTO, w.AMTRAK),
                        resolveStop(places.TRUCKEE, w.AMTRAK),
                        resolveStop(places.RENO, w.AMTRAK)
                    ]),
                    '09:10', '12:20', 60);
        })).toMatchSnapshot();
    });
});


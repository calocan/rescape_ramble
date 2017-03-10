
import * as places from './places';
import * as helper from './dataCreationHelpers';
import * as w from './stops';
import * as regions from './regions';
import * as routeTypes from './routeTypes';
import {DEFAULT_SERVICE} from './services'

describe('dataCreationHelpers', () => {
    test('Creates a Stop id from a Place and Stop location', () => {
        expect(helper.createStopId(places.LOS_ANGELES, w.UNION)).toMatchSnapshot();
    });

    test('Creates a Stop', () => {
        expect(helper.createStop(
            places.LOS_ANGELES, w.UNION, { lon: -118.236502, lat: 34.056219 }
        )).toMatchSnapshot();
        expect(helper.createStop(
            places.LOS_ANGELES, w.UNION, { lon: -118.236502, lat: 34.056219 },
            {stopName:'LA Fancy Station'}
        )).toMatchSnapshot();
        expect(helper.createStop(
            places.LOS_ANGELES, w.UNION, { lon: -118.236502, lat: 34.056219 },
            {stopType:'MegaStation'}
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
});



import {createStop} from './dataCreationHelpers'

// Regions
export const NORTH_BAY = 'North-Bay'
export const ALTAMONT = 'Altamont'

// Places
export const SFC = {id: 'SFC', label: 'San Francisco'}
export const OAK = {id: 'OAK', label: 'Oakland'}
export const SKN = {id: 'SKN', label: 'Stockton'}
export const TRU = {id: 'TRU', label: 'Truckee'}

export default [
    createStop(OAK, {
        lon: -122.277158,
        lat: 37.806624
    }, 'Central'),
    createStop(SKN, {
        lon: -122.277158,
        lat: 37.806624
    }, 'Amtrak'),
    createStop(TRU, {
        lon: -120.185620,
        lat: 39.327493
    }, 'Amtrak', 'Depot'
    'TRU-Central': Map({
        id: 'TRU-Central',
        label: 'Truckee Amtrak Depot',
        stopName: Map()
    }),
    'SAC-Central': Map({
        id: 'SAC-Central',
        stopName: 'Sacramento Union Station',
        point: Map({
            lon: -121.500675,
            lat: 38.584162
        })
    }),
    'SFC-Central': Map({
        id: 'SFC-Central',
        stopName: 'San Francisco Transbay Terminal',
        point: Map({
            lon: -122.392481,
            lat: 37.789339
        })
    }),
    'LAX-Central': Map({
        id: 'LAX-Central',
        stopName: 'Los Angeles Union Station',
        point: Map({
            lon: -118.236502,
            lat: 34.056219
        })
    }),
    'PLS-Central': Map({
        id: 'PLS-Central',
        stopName: 'Pleasanton Central Station',
        point: Map({
            lon: -121.899181,
            lat: 37.701650
        })
    }),
    'SUI-Central': Map({
        id: 'SUI-Central',
        stopName: 'Suisun-Fairfield Amtrak Station',
        point: Map({
            lon: -122.041192,
            lat: 38.243449
        })
    }),
    'RNO-Central': Map({
        id: 'RNO-Central',
        stopName: 'Reno Amtrak Station',
        point: Map({
            lon: -122.041192,
            lat: 38.243449
        })
    }),
}


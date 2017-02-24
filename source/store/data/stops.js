
import {createStop} from './dataCreationHelpers'
import * as places from './places'

export default [
    createStop(places.LOS_ANGELES,
        { lon: -118.236502, lat: 34.056219 },
        { which: 'Union' }
    ),
    createStop(places.OAKLAND,
        { lon: -122.277158, lat: 37.806624 },
        { which: 'Central'}
    ),
    createStop(places.PLEASANTON,
        { lon: -121.899181, lat: 37.701650 },
        { which: 'ACE' }
    ),
    createStop(places.RENO,
        { lon: -122.041192, lat: 38.243449 },
        { which: 'Amtrak' }
    ),
    createStop(places.SACRAMENTO,
        { lon: -121.500675, lat: 38.584162 },
        { which: 'Union'}
    ),
    createStop(places.SAN_FRANCISCO,
        { lon: -122.392481, lat: 37.789339 },
        { which: 'Transbay', stopType: 'Terminal' }
    ),
    createStop(places.STOCKTON,
        { lon: -122.277158, lat: 37.806624 },
        { which: 'Amtrak'}
    ),
    createStop(places.SUISON_FAIRFIELD,
        { lon: -122.041192, lat: 38.243449 },
        { which: 'Amtrak' }
    ),
    createStop(places.TRUCKEE,
        { lon: -120.185620, lat: 39.327493 },
        { which: 'Amtrak', stopType: 'Depot' }
    ),
]



const {createStop} = require('data/dataCreationHelpers');
const places = require('./californiaPlaces');
const stopTypes = require('../default/stopTypes');

const UNION = module.exports.UNION = 'Union';
const CENTRAL = module.exports.CENTRAL = 'Central';
const JACK_LONDON_SQUARE = module.exports.JACK_LONDON_SQUARE = 'Jack London Square';
const ACE = module.exports.ACE = 'ACE';
const TRANSBAY = module.exports.TRANSBAY = 'Transbay';
const AMTRAK = module.exports.AMTRAK = 'Amtrak';

module.exports.default = [
    createStop(places.LOS_ANGELES, UNION,
        { lon: -118.236502, lat: 34.056219 },
    ),
    createStop(places.OAKLAND, CENTRAL,
        { lon: -122.277158, lat: 37.806624 },
    ),
    createStop(places.OAKLAND, JACK_LONDON_SQUARE,
        { lon: -122.271522, lat: 37.793814 },
    ),
    createStop(places.PLEASANTON, ACE,
        { lon: -121.899181, lat: 37.701650 }
    ),
    createStop(places.RENO, AMTRAK,
        { lon: -122.041192, lat: 38.243449 }
    ),
    createStop(places.SACRAMENTO, UNION,
        { lon: -121.500675, lat: 38.584162 }
    ),
    createStop(places.SAN_FRANCISCO, TRANSBAY,
        { lon: -122.392481, lat: 37.789339 },
        { stopType: stopTypes.TERMINAL }
    ),
    createStop(places.STOCKTON, AMTRAK,
        { lon: -121.285602, lat: 37.945332 }
    ),
    createStop(places.SUISON_FAIRFIELD, AMTRAK,
        { lon: -122.041192, lat: 38.243449 },
    ),
    createStop(places.TRUCKEE, AMTRAK,
        { lon: -120.185620, lat: 39.327493 },
        { stopType: stopTypes.DEPOT }
    )
];



/**
 * @typedef {Object} Place
 * @property {string} id primary station code for the Place. This is used to id stops uniquely in conjunction
 * with which stop it is of the place (e.g. code SFC could be used for stops (SFC-Transbay, SFC-4thAndKing).
 * If another station code exists for a station like SFW for San Franicsco Fisherman's Warf, it could override
 * the automatically Stop id created from this id.
 * @property {number} label name of the Place
 */

// Places are general areas--cities, counties, national parks, universities, etc that contain 0 or more transit stops
// They are identified by their primary AMTRAK station id, from which stop ids are created along with which stop it
// is. So a Stop id at LA Union station would be LAX-Union and at the airport would be LAX-Airport. In the case
// that AMTRAK has ids for secondary stops (e.g. Oakland Coliseum is OAC, we can either disregard that id or do an
// override on the Stop to make OAC-Coliseum instead of the default OAK-Coliseum, but the latter is probably better)
module.exports.LOS_ANGELES = {id: 'LAX', label: 'Los Angeles'};
module.exports.OAKLAND = {id: 'OAK', label: 'Oakland'};
module.exports.PLEASANTON = {id: 'PLS', label: 'Pleasanton'};
module.exports.RENO = {id: 'REN', label: 'Reno'};
module.exports.SACRAMENTO = {id: 'SAC', label: 'Sacramento'};
module.exports.SAN_FRANCISCO = {id: 'SFC', label: 'San Francisco'};
module.exports.SUISON_FAIRFIELD = {id: 'SUI', label: 'Suison-Fairfield'};
module.exports.STOCKTON = {id: 'SKN', label: 'Stockton'};
module.exports.TRUCKEE = {id: 'TRU', label: 'Truckee'};


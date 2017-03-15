
/**
 * @typedef {Object} Place
 * @property {string} id primary station code for the Place. This is used to id stops uniquely in conjunction
 * with which stop it is of the place (e.g. code SFC could be used for stops (SFC-Transbay, SFC-4thAndKing).
 * If another station code exists for a station like SFW for San Franicsco Fisherman's Warf, it could override
 * the automatically Stop id created from this id.
 * @property {number} label name of the Place
 */

// Places
export const LOS_ANGELES = {id: 'LAX', label: 'Los Angeles'};
export const OAKLAND = {id: 'OAK', label: 'Oakland'};
export const PLEASANTON = {id: 'PLS', label: 'Pleasanton'};
export const RENO = {id: 'REN', label: 'Reno'};
export const SACRAMENTO = {id: 'SAC', label: 'Sacramento'};
export const SAN_FRANCISCO = {id: 'SFC', label: 'San Francisco'};
export const SUISON_FAIRFIELD = {id: 'SUI', label: 'Suison-Fairfield'};
export const STOCKTON = {id: 'SKN', label: 'Stockton'};
export const TRUCKEE = {id: 'TRU', label: 'Truckee'};


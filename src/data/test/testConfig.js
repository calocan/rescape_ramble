/**
 * Created by Andy Likuski on 2017.03.28
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {mergeDeep, mapKeys} = require('rescape-ramda');
const R = require('ramda');
const prefix = k => R.concat('oakland', R.toUpper(k));
const {oaklandConfig, oaklandData} = mapKeys(prefix('oakland'), require('./oakland-sample'));
const {parisConfig, parisData} = mapKeys(prefix('paris'), require('./paris-sample'));

const testConfigs = module.exports.testConfig = R.mergeAll([oaklandConfig, parisConfig]);
module.exports.default = R.merge(
        // Combine everything but the regions key
        mergeDeep(...R.map(R.omit('regions'), testConfigs)),
        // Combine the region array of each config
        {regions: R.reduce(
            R.concat,
            [],
            R.map(R.prop('regions'), testConfigs)
        )}
    );

/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import R from 'ramda';
import {mapPropValueAsIndex, toImmutable} from '../../helpers/functions';

/***
 * Returns a function that can be applied to a list to add an id value to each object of the list
 * and then change the list to an object keyed by the id value. This is only useful for sample data
 * that doesn't have an id
 * @param generator
 * toObjectKeyedByGeneratedId:: [<k, v>] -> <v.id, <k, v>>
 */
export const toObjectKeyedByGeneratedId = generator => R.pipe(
    R.map(item => R.merge(item, {id: generator.next().value})), // Add a generated id
    mapPropValueAsIndex('id') // make the id the key
);
const toObjectKeyedById = mapPropValueAsIndex('id');

export default (config) => {
    return {
        settings: config.settings,
        travel: R.map(toObjectKeyedByGeneratedId, config.travel),
        gtfs: R.map(toObjectKeyedById, config.gtfs),
        // The viewport must be an Immutable to satisfied the redux-map-gl reducer
        mapbox: R.over(R.lensProp('viewport'), toImmutable, config.mapbox)
    }
};


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
// Maps the array to objects keyed by id and also inserts a 'current' key to reference the given currentKey
// toObjectKeyedByIdWithCurrent:: String -> [{k,v}] -> {j|currentKey, {k, v}}
const toObjectKeyedByIdWithCurrent = R.curry((currentKey, object) => {
    const obj = toObjectKeyedById(object);
    return {
        currentKey: currentKey,
        ...obj
    }
});

/***
 * Returns an initialState based on the given region config. It's possible to configure the state
 * to have multiple regions, but this function only assumes a single initial region
 * @param config
 * @return {{settings: (*|store.settings|{}|body.settings|{foo}|settings), travel: *, gtfs: *, mapbox: *}}
 */
export default (config) => {
    return {
        settings: config.settings,
        regions: toObjectKeyedByIdWithCurrent(config.id, [
            {
                id: config.id,
                geospatial: config.geospatial,
                // make each array of objects in travel to an object by array object id
                travel: R.map(toObjectKeyedByGeneratedId, config.travel),
                // make each array of objects in gtf to an object by array object id
                gtfs: R.map(toObjectKeyedById, config.gtfs),
                // The viewport must be an Immutable to satisfied the redux-map-gl reducer
                // Apply toImmutable to the viewport of config.mapbox
                mapbox: R.over(R.lensProp('viewport'), toImmutable, config.mapbox)
            }
        ])
    }
};


/**
 * Created by Andy Likuski on 2017.02.26
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {fromJS} from 'immutable';

/***
 * Return an empty string if the given entity is falsy
 * @param entity
 */
export const orEmpty = entity => entity || "";

/***
 * Use the given function to create a filter partial that takes an iterable and creates a generator to apply the filter
 * @param fn
 */
export const filterWith = fn => {
    return function * (iterable) {
        for (let element in iterable) {
            if (!!fn(element))
                yield element;
        }
    }
};

/***
 * Removed null or undefined items from an iterable
 * @param {Iterable} iterable that might have null or undefined values to remove
 * @returns {Iterable} an iterable that filters out null or undefined items
 */
export const compact = filterWith(item => item != null && item != undefined);

/***
 * Convert the obj to an Immutable if it is not.
 * @param obj
 */
export const toImmutable = obj => Iterable.isIterable(obj) ? obj : fromJS(obj);
/***
 * Use the given function to create a partial mapping function that expects an iterable
 * @param fn
 */
export const mapWith = fn => iter => iter.map(fn);
/***
 * Creates a partial mapping function that expects an iterable and maps each item of the iterable to the given property
 * @param prop
 */
export const mapProp = prop => mapWith(item => item[prop]);

/***
 * Creates a partial function that maps an array to an object keyed by the given prop, valued by the item
 * @param prop
 * @returns {function} Accepts an iterable and returns an objected key by the given prop, valued by the item
 */
export const mapPropAsKey = prop => new Map( mapWith(item => [item[prop], item]) );

/***
 * Creates a partial function that expects a property of an object which in turn returns a function that
 * expects a listOrObj
 * If listOrObj is not already object, the function converts an array to an Immutable keyed by each array items id.
 * If alreay an object, it just makes it immutable
 * @param listOrObj
 * @returns {*|Map<K, V>|Map<string, V>}
 */
export const toImmutableKeyedByProp = prop => listOrObj => {
    const resolved = toImmutable(listOrObj);
    return Map.isMap(resolved) ? resolved : mapPropAsKey(prop);
};

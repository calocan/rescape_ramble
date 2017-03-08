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
import {fromJS, Iterable, Map} from 'immutable';
import R from 'ramda';

/***
 * Return an empty string if the given entity is falsy
 * @param entity
 */
export const orEmpty = entity => entity || '';

/***
 * Use the given function to create a filter partial that takes an iterable and creates a generator to apply the filter
 * @returns A function that expects a filter function
 */
export const filterWith = R.filter;

/***
 * Removed null or undefined items from an iterable
 * @param {Iterable} iterable that might have null or undefined values to remove
 * @returns {Iterable} an iterable that filters out null or undefined items
 */
export const compact = R.reject(R.isNil)

/***
 * Convert the obj to an Immutable if it is not.
 * @param obj
 */
export const toImmutable = obj => Iterable.isIterable(obj) ? obj : fromJS(obj);

/***
 * Use the given function to create a partial mapping function that expects an iterable
 * @returns A function that expects a mapping function
 */
export const mapWith = R.map;

/***
 * Creates a partial mapping function that expects an iterable and maps each item of the iterable to the given property
 * @returns A function that expects a prop
 */
export const mapProp = R.compose(R.map, R.prop);

/***
 * Creates a partial function that maps an array of objects to an object keyed by the given prop of the objects
 * of the array, valued by the item
 * @param prop
 * @returns {function} Accepts an iterable and returns an objected key by the given prop, valued by the item
 */
//export const mapPropAsKey = prop => R.map(R.mapObjectIndexed(R.prop(prop)));
export const mapPropAsKey = prop => R.compose(R.map, R.mapObjectIndexed, R.prop)(prop);

/***
 * Creates a partial function that expects a property of an object which in turn returns a function that
 * expects a listOrObj
 * If listOrObj is not already object, the function converts an array to an Immutable keyed by each array items id.
 * If alreay an object, it just makes it immutable
 * @param listOrObj
 * @returns A function that expects a listOrObj
 */
export const toImmutableKeyedByProp = prop =>
    R.compose(R.unless(Map.isMap(R._), mapPropAsKey(prop)), toImmutable);

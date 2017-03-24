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
import {fromJS, Iterable} from 'immutable';
import R from 'ramda';

/***
 * Return an empty string if the given entity is falsy
 * @param entity
 * orEmpty:: a -> a
 *        :: a -> String
 */
export const orEmpty = entity => entity || '';

/***
 * Removed null or undefined items from an iterable
 * @param [a] items Items that might have falsy values to remove
 * compact:: [a] -> [a]
 */
export const compact = R.reject(R.isNil);

/***
 * Remove empty strings
 * @param [a] items Items that might have empty or null strings to remove
 * compactEmpty:: [a] -> [a]
 */
export const compactEmpty = R.reject(R.either(R.isNil, R.isEmpty));

/**
 * Convert an empty value to null
 * @param a item Item that might be empty according to isEmpty
 * emptyToNull:: a -> a
 *            :: a -> null
 */
export const emptyToNull = R.when(R.isEmpty, ()=>null);

/***
 * Join elements, first remove null items and empty strings. If the result is empty make it null
 * @param connector Join connector string
 * @param [a] items Items to join that might be removed
 * compactEmpty:: [a] -> String
 *             :: [a] -> null
 */
export const compactJoin = R.compose(
    (connector, items) => R.pipe(compactEmpty, R.join(connector), emptyToNull)(items)
);

/***
 * Convert the obj to an Immutable if it is not.
 * @param {a} a An Immutable or anything else
 * toImmutable:: Immutable b = a -> b
 *            :: Immutable b = b -> b
 */
export const toImmutable = obj => Iterable.isIterable(obj) ? obj : fromJS(obj);

/***
 * Converts an Immutable to javascript
 * @param {Map} obj
 * toJS:: Immutable a = a -> b
 */
export const toJS = obj => obj.toJS();

/***
 * Convert the Immutable to plain JS if it is not
 * @param obj
 * fromImmutable:: Immutable b = b -> a
 *              :: a-> a
 */
export const fromImmutable = obj =>
    R.ifElse(
        Iterable.isIterable,
        toJS,
        R.when(Array.isArray, R.map(fromImmutable))
    )(obj);

/***
 * Creates a partial mapping function that expects an iterable and maps each item of the iterable to the given property
 * @param {String} prop The prop of each object to map
 * @param {[Object]} items The objects to map
 * mapProp :: String -> [{k, v}] -> [a]
 */
export const mapProp = R.curry((prop, objs) => R.pipe(R.prop, R.map)(prop)(objs));

/***
 * Creates a partial function that maps an array of objects to an object keyed by the given prop of the objects
 * of the array, valued by the item. If the item is not an array, it leaves it alone, assuming it is already indexed
 * @param {String} prop The prop of each object to use as the key
 * @param {[Object]} items The items to map
 * mapPropValueAsIndex:: String -> [{k, v}] -> {j, {k, v}}
 * mapPropValueAsIndex:: String -> {k, v} -> {k, v}
 */
export const mapPropValueAsIndex = R.curry((prop, obj) =>
    R.when(
        Array.isArray,
        R.pipe(R.prop, R.indexBy)(prop)
    )(obj));

/***
 * Creates a partial function that expects a property of an object which in turn returns a function that
 * expects a listOrObj
 * If listOrObj is not already object, the function converts an array to an Immutable keyed by each array items id.
 * If already an object, it just makes it immutable
 * @param listOrObj
 * mapPropValueAsIndex:: Immutable m = {j, {k, v}} -> m {j, {k, v}}
 *                    :: Immutable m = [{k, v}] -> m {j, {k, v}}
 */
export const toImmutableKeyedByProp = R.curry((prop, objs) =>
    R.pipe(
        R.when(Array.isArray, mapPropValueAsIndex(prop)),
        toImmutable
    )(objs)
);

/***
 * Returns the id of the given value if it is an object or the value itself if it is not.
 * @param {Object|String|Number} objOrId
 * @param {String|Number}
 * idOrIdFromObj:: a -> a
 *              :: {k, v} -> a
 */
export const idOrIdFromObj = R.when(
    objOrId => (typeof objOrId === 'object') && objOrId !== null,
    R.prop('id')
);

/***
 * Reduces with the current and next value of a list. The reducer is called n-1 times for a list of n length
 * @param {callWithNext} fn reducer
 * @param {Object} head first item of the list
 * @param {Object} next remaining items
 * @param {Object} previous initial reduction value
 * @return {Object} the reduction
 */
export const reduceWithNext = (fn, [head, next, ...tail], previous) =>
    next === undefined ?
        previous :
        reduceWithNext(fn, [next, ...tail], fn(previous, head, next));

/**
 * @callback callWithNext
 * @param {Object} total the reduction
 * @param {Object} current the current item
 * @param {Object} next the next item
 * @returns {Object} the next reduction
 */

/***
 * Deep merge values that are objects but not arrays
 * based on https://github.com/ramda/ramda/pull/1088
 * @type {Immutable.Map<string, V>|__Cursor.Cursor|List<T>|Map<K, V>|*}
 * mergeDeep:: (<k, v>, <k, v>) -> <k, v>
 */
export const mergeDeep = R.mergeWith((l, r) =>
    (l.concat || r.concat) || !(R.is(Object, l) && R.is(Object, r)) ?
        r:
        mergeDeep(l, r) // tail recursive
)

/***
 * http://stackoverflow.com/questions/40011725/point-free-style-capitalize-function-with-ramda
 * Capitalize the first letter
 * capitalize:: String -> String
 */
export const capitalize = R.compose(
    R.join(''),
    R.juxt([R.compose(R.toUpper, R.head), R.tail])
);

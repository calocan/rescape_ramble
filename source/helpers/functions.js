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
const {fromJS, Iterable} = require('immutable');
const R = require('ramda');
const Rm = require('ramda-maybe');
const prettyFormat = require('pretty-format');
const Task = require('data.task');
const stackTrace = require('stack-trace');
const {Maybe, Either} = require('ramda-fantasy');

/**
 * Return an empty string if the given entity is falsy
 * @param entity
 * orEmpty:: a -> a
 *        :: a -> String
 */
const orEmpty = module.exports.orEmpty = entity => entity || '';

/**
 * Removed null or undefined items from an iterable
 * @param [a] items Items that might have falsy values to remove
 * compact:: [a] -> [a]
 * compact:: {k,v} -> {k,v}
 */
const compact = module.exports.compact = R.reject(R.isNil);

/**
 * Remove empty strings
 * @param [a] items Items that might have empty or null strings to remove
 * compactEmpty:: [a] -> [a]
 */
const compactEmpty = module.exports.compactEmpty = R.reject(R.either(R.isNil, R.isEmpty));

/**
 * Convert an empty value to null
 * @param a item Item that might be empty according to isEmpty
 * emptyToNull:: a -> a
 *            :: a -> null
 */
const emptyToNull = module.exports.emptyToNull = R.when(R.isEmpty, ()=>null);

/**
 * Join elements, first remove null items and empty strings. If the result is empty make it null
 * @param connector Join connector string
 * @param [a] items Items to join that might be removed
 * compactEmpty:: [a] -> String
 *             :: [a] -> null
 */
const compactJoin = module.exports.compactJoin = R.compose(
    (connector, items) => R.pipe(compactEmpty, R.join(connector), emptyToNull)(items)
);

/**
 * Convert the obj to an Immutable if it is not.
 * @param {a} a An Immutable or anything else
 * toImmutable:: Immutable b = a -> b
 *            :: Immutable b = b -> b
 */
const toImmutable = module.exports.toImmutable = obj => Iterable.isIterable(obj) ? obj : fromJS(obj);

/**
 * Converts an Immutable to javascript if it's an Immutable
 * @param {Map|Object} obj
 * toJS:: Immutable a = a -> b
 */
const toJS = module.exports.toJS = obj => obj.toJS ? obj.toJS() : obj;

/**
 * Convert the Immutable to plain JS if it is not
 * @param obj
 * fromImmutable:: Immutable b = b -> a
 *              :: a-> a
 */
const fromImmutable = module.exports.fromImmutable = obj =>
    R.ifElse(
        Iterable.isIterable,
        toJS,
        R.when(Array.isArray, R.map(fromImmutable))
    )(obj);

/**
 * Creates a partial mapping function that expects an iterable and maps each item of the iterable to the given property
 * @param {String} prop The prop of each object to map
 * @param {[Object]} items The objects to map
 * mapProp :: String -> [{k, v}] -> [a]
 */
const mapProp = module.exports.mapProp = R.curry((prop, objs) => R.pipe(R.prop, R.map)(prop)(objs));

/**
 * Creates a partial function that maps an array of objects to an object keyed by the given prop of the object's
 * of the array, valued by the item. If the item is not an array, it leaves it alone, assuming it is already indexed
 * @param {String} prop The prop of each object to use as the key
 * @param {[Object]} items The items to map
 * mapPropValueAsIndex:: String -> [{k, v}] -> {j, {k, v}}
 * mapPropValueAsIndex:: String -> {k, v} -> {k, v}
 */
const mapPropValueAsIndex = module.exports.mapPropValueAsIndex = R.curry((prop, obj) =>
    R.when(
        Array.isArray,
        R.pipe(R.prop, R.indexBy)(prop)
    )(obj));

/**
 * Merges a list of objects by the given key and returns the values, meaning all items that are
 * duplicate prop key value are removed from the final list
 * removeDuplicateObjectsByProp:: String -> [{k, v}] -> [{k, v}]
 */
const removeDuplicateObjectsByProp = module.exports.removeDuplicateObjectsByProp = R.curry((prop, list) =>
    R.pipe(
        mapPropValueAsIndex(prop),
        R.values
    )(list)
);

/**
 * Creates a partial function that expects a property of an object which in turn returns a function that
 * expects a listOrObj
 * If listOrObj is not already object, the function converts an array to an Immutable keyed by each array items id.
 * If already an object, it just makes it immutable
 * @param listOrObj
 * mapPropValueAsIndex:: Immutable m = {j, {k, v}} -> m {j, {k, v}}
 *                    :: Immutable m = [{k, v}] -> m {j, {k, v}}
 */
const toImmutableKeyedByProp = module.exports.toImmutableKeyedByProp = R.curry((prop, objs) =>
    R.pipe(
        R.when(Array.isArray, mapPropValueAsIndex(prop)),
        toImmutable
    )(objs)
);

/**
 * Returns the id of the given value if it is an object or the value itself if it is not.
 * @param {Object|String|Number} objOrId
 * @param {String|Number}
 * idOrIdFromObj:: a -> a
 *              :: {k, v} -> a
 */
const idOrIdFromObj = module.exports.idOrIdFromObj = R.when(
    objOrId => (typeof objOrId === 'object') && objOrId !== null,
    R.prop('id')
);

/**
 * Reduces with the current and next value of a list. The reducer is called n-1 times for a list of n length
 * @param {callWithNext} fn reducer
 * @param {Object} head first item of the list
 * @param {Object} next remaining items
 * @param {Object} previous initial reduction value
 * @return {Object} the reduction
 */
const reduceWithNext = module.exports.reduceWithNext = (fn, [head, next, ...tail], previous) =>
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

/**
 * Deep merge values that are objects but not arrays
 * based on https://github.com/ramda/ramda/pull/1088
 * @type {Immutable.Map<string, V>|__Cursor.Cursor|List<T>|Map<K, V>|*}
 * mergeDeep:: (<k, v>, <k, v>) -> <k, v>
 */
const mergeDeep = module.exports.mergeDeep = R.mergeWith((l, r) =>
    (l.concat || r.concat) || !(R.is(Object, l) && R.is(Object, r)) ?
        r :
        mergeDeep(l, r) // tail recursive
);

/**
 * http://stackoverflow.com/questions/40011725/point-free-style-capitalize-function-with-ramda
 * Capitalize the first letter
 * capitalize:: String -> String
 */
const capitalize = module.exports.capitalize = obj => R.compose(
    R.join(''),
    R.juxt([R.compose(R.toUpper, R.head), R.tail])
)(obj);

/**
 * Merge a list of objects using the given concat function
 * [{k: v}] → {k: v}
 * mergeAllWithKey:: (String → a → a → a) → [{a}] → {a}
 */
const mergeAllWithKey = module.exports.mergeAllWithKey = R.curry((fn, [head, ...rest]) =>
    R.mergeWithKey( // call mergeWithKey on two objects at a time
        fn,
        head || {}, // first object is always the head
        R.ifElse( // second object is the merged object of the recursion
            R.isEmpty, // if no rest
            () => R.empty({}), // end case empty object
            mergeAllWithKey(fn), // else recurse with the rest
        )(rest)
    )
);

/**
 * Get a required path or return a helpful Error if it fails
 * @param {String} path A lensPath, e.g. ['a', 'b'] or ['a', 2, 'b']
 * @param {Object} obj The object to inspect
 * reqPath:: String -> {k: v} → Either
 */
const reqPath = module.exports.reqPath = R.curry((path, obj) => {
    return R.compose(
            R.ifElse(
                Maybe.isNothing,
                () => Either.Left({
                    resolved: R.reduceWhile(
                        // Stop if the accumulated segments can't be resolved
                        (segments, segment) => R.not(R.isNil(R.path(R.concat(segments, [segment]), obj))),
                        // Accumulate segments
                        (segments, segment) => R.concat(segments, [segment]),
                        [],
                        path
                    ),
                    path: path
                }),
                res => Either.Right(res.value)
            ),
            Rm.path(path))(obj);
    }
);

/**
 * Use immutable to make a deep copy of an object
 * copy:: a -> a
 */
const copy = module.exports.copy = R.compose(toJS, toImmutable);

/**
 * Wraps a Task in a Promise.
 * @param {Task} task
 * @param {boolean} expectReject Set true for testing when a rejection is expected
 * @return {Promise}
 */
const taskToPromise = module.exports.taskToPromise = (task, expectReject = false) => {
    if (!task.fork) {
        throw new TypeError(`Expected a Task, got ${typeof task}`);
    }
    return new Promise((res, rej) =>
        task.fork(
            reject => {
                if (!expectReject) {
                    console.log('Unhandled Promise', prettyFormat(reject));
                    if (reject && reject.stack) {
                        console.log(stackTrace.parse(reject));
                    }
                }
                return rej(reject);
            },
            resolve => res(resolve)
        )
    );
};

/**
 * Wraps a Promise in a Task
 * @param {Promise} promise
 * @param {boolean} expectReject default false. Set true for testing to avoid logging rejects
 */
const promiseToTask = module.exports.promiseToTask = (promise, expectReject = false) => {
    if (!promise.then) {
        throw new TypeError(`Expected a Promise, got ${typeof promise}`);
    }
    return new Task((rej, res) => promise.then(res).catch(reject => {
        if (!expectReject) {
            console.warn('Unhandled Promise', prettyFormat(reject));
            console.warn(reject.stack);
        }
        return rej(reject);
    }));
};

/**
 * From the cookbook: https://github.com/ramda/ramda/wiki/Cookbook#map-keys-of-an-object
 * mapKeys :: (String -> String) -> Object -> Object
*/
const mapKeys = module.exports.mapKeys = R.curry((fn, obj) =>
    R.fromPairs(R.map(R.adjust(fn, 0), R.toPairs(obj))));

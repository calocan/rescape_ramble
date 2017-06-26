/**
 * Created by Andy Likuski on 2017.02.26
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {Map as ImMap} from 'immutable';
import R from 'ramda';
import * as f from './functions';
import Task from 'data.task'

describe('helperFunctions', () => {
    test('Should be empty', () => {
        expect(f.orEmpty(null)).toEqual('');
    });
    test('Should filter out null and undef values', () => {
        expect(f.compact([1, null, 2])).
        toEqual([1, 2]);
    });
    test('Should filter out null and empty values', () => {
        expect(f.compactEmpty(['', null, []])).
        toEqual([]);
    });
    test('Should filter out null and empty values', () => {
        expect(f.emptyToNull('')).
        toEqual(null);
    });
    test('Should filter out null and empty values', () => {
        expect(f.compactJoin('-', ['', 'a', null, 'b'])).
        toEqual('a-b');
        expect(f.compactJoin('-', ['', null])).
        toEqual(null);
    });
    test('Should be an Immutable Map', () => {
        expect(ImMap.isMap(f.toImmutable({foo: 1}))).
        toBeTruthy();
    });
    test('Should be a plain old javascript object', () => {
        expect(!ImMap.isMap(f.fromImmutable(f.toImmutable({foo: 1})))).
        toBeTruthy();
        expect(f.fromImmutable([f.toImmutable({foo: 1})])).toMatchSnapshot();
    });
    test('Should map bars', () => {
        expect(f.mapProp('bar')([{bar: 1}, {bar: 2}])).
        toEqual([1, 2]);
    });
    test('Should map prop as key', () => {
        expect(f.mapPropValueAsIndex('bar')([{bar: 1}, {bar: 2}])).
        toEqual(R.indexBy(R.prop('bar'), [{bar: 1}, {bar: 2}]))
    });
    test('Should remove duplicate objects with same prop key', () => {
        expect(f.removeDuplicateObjectsByProp('bar')([{bar: 1, foo: 2}, {bar: 1, foo: 2}, {bar: 2}])).
        toEqual([{bar: 1, foo: 2}, {bar: 2}])
    });
    test('Should be immutable and keyed by prop', () => {
        expect(f.toImmutableKeyedByProp('bar')([{bar: 1}, {bar: 2}]).toJS()).
        toEqual(ImMap([[1, {bar: 1}], [2, {bar: 2}]]).toJS())
    });
    test('Should return an id from an object or the identify from a value', () => {
        expect(f.idOrIdFromObj('foo')).toEqual('foo');
        expect(f.idOrIdFromObj({id: 'foo'})).toEqual('foo');
    });
    test('Should sum up distance between', () => {
        expect(f.reduceWithNext(
            (previous, current, next) => previous + (next - current),
            [1, 4, 9, 16],
            0)).toEqual((4 - 1) + (9 - 4) + (16 - 9));
    });
    test('Should concat with sums of distance between', () => {
        expect(f.reduceWithNext(
            (previous, current, next) => previous.concat([next - current]),
            [1, 4, 9, 16],
            [])).toEqual([4 - 1, 9 - 4, 16 - 9]);
    });
    test('Should deep merge objects', () => {
        expect(f.mergeDeep(
            {foo: 1, bar: {bizz: [2, 3], buzz: 7}},
            {foo: 4, bar: {bizz: [5, 6]}}
        )).toEqual({foo: 4, bar: {bizz: [5, 6], buzz: 7}});
    })
    test('Should capitalize first letter', () => {
        expect(f.capitalize('good grief')).toEqual('Good grief')
    })
    test('Should merge all with key', () => {
        expect(
            f.mergeAllWithKey(
                (k, l, r) => k === 'a' ? R.concat(l, r) : r,
                [{a: [1], b: 2}, {a: [2], c: 3}, {a: [3]}]
        )).toEqual({a: [1, 2, 3], b: 2, c: 3});
    })
    test('Should getPath of object', () => {
        expect(
            f.getPath(['a', 'b', 1, 'c'], {a: {b: [null, {c: 2}]}})
        ).toEqual(2)
    })
    test('Should copy an object', () => {
        const obj = { a: {b: 1}};
        const copy = f.copy(obj);
        expect(obj).toEqual(copy);
        expect(obj).not.toBe(copy);
        expect(obj.a).toEqual(copy.a);
        expect(obj.a).not.toBe(copy.a);
    })
    test('Should convert Task to Promise', () => {
        expect(f.taskToPromise(new Task(function(reject, resolve) {
            resolve('donut')
        }))).resolves.toBe('donut')
        expect(f.taskToPromise(new Task(function(reject) {
            reject(new Error('octopus'))
        }), true)).rejects.toThrow()
    })
});

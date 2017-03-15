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
import * as Rx from './functions';

describe('helperFunctions', () => {
    test('Should be empty', () => {
        expect(Rx.orEmpty(null)).toEqual('');
    });
    test('Should filter out null and undef values', () => {
        expect(Rx.compact([1, null, 2])).
        toEqual([1, 2]);
    });
    test('Should be an Immutable Map', () => {
        expect(ImMap.isMap(Rx.toImmutable({foo: 1}))).
        toBeTruthy();
    });
    test('Should be a plain old javascript object', () => {
        expect(!ImMap.isMap(Rx.fromImmutable(Rx.toImmutable({foo: 1})))).
        toBeTruthy();
        expect(Rx.fromImmutable([Rx.toImmutable({foo: 1})])).toMatchSnapshot();
    });
    test('Should map bars', () => {
        expect(Rx.mapProp('bar')([{bar: 1}, {bar: 2}])).
        toEqual([1, 2]);
    });
    test('Should map prop as key', () => {
        expect(Rx.mapPropValueAsIndex('bar')([{bar: 1}, {bar: 2}])).
        toEqual(R.indexBy(R.prop('bar'), [{bar: 1}, {bar: 2}]))
    });
    test('Should be immutable and keyed by prop', () => {
        expect(Rx.toImmutableKeyedByProp('bar')([{bar: 1}, {bar: 2}]).toJS()).
        toEqual(ImMap([[1, {bar: 1}], [2, {bar: 2}]]).toJS())
    });
    test('Should return an id from an object or the identify from a value', () => {
        expect(Rx.idOrIdFromObj('foo')).toEqual('foo');
        expect(Rx.idOrIdFromObj({id: 'foo'})).toEqual('foo');
    });
    test('Should sum up distance between', () => {
        expect(Rx.reduceWithNext(
            (previous, current, next) => previous + (next - current),
            [1, 4, 9, 16],
            0)).toEqual((4 - 1) + (9 - 4) + (16 - 9));
    });
    test('Should concat with sums of distance between', () => {
        expect(Rx.reduceWithNext(
            (previous, current, next) => previous.concat([next - current]),
            [1, 4, 9, 16],
            [])).toEqual([4 - 1, 9 - 4, 16 - 9]);
    });
    test("Should deep merge objects", () => {
        expect(Rx.mergeDeep(
            {foo: 1, bar: {bizz: [2, 3], buzz: 7}},
            {foo: 4, bar: {bizz: [5, 6]}}
        )).toEqual({foo: 4, bar: {bizz: [5, 6], buzz: 7}});
    })
});

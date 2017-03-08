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
import {Map as ImMap, Immutable} from 'immutable';
import * as functions from './functions';

describe('helperFunctions', () => {
        test('Should be empty', () => {
            expect(functions.orEmpty(null)).toEqual('');
        });
        test('Should filter out even numbers', () => {
            expect(functions.filterWith(x => x % 2)([1, 2, 3, 4])).toEqual([1, 3]);
        });
        test('Should filter out null and undef values', () => {
            expect(functions.compact([1, null, 2])).toEqual([1, 2]);
        });
        test('Should be an Immutable Map', () => {
            expect(ImMap.isMap(functions.toImmutable({foo: 1}))).toBeTruthy();
        });
        test('Should be an array of 1s', () => {
            expect(functions.mapWith(() => 1)([1, 2, 3, 4])).toEqual([1, 1, 1, 1]);
        });
        test('Should map bars', () => {
            expect(functions.mapProp('bar')([{bar: 1}, {bar: 2}])).toEqual([1, 2]);
        });
        test('Should map prop as key', () => {
            expect(functions.mapPropAsKey('bar')([{bar: 1}, {bar: 2}])).toEqual(
                Map([[1, {bar: 1}], [2, {bar: 2}]]));
        });
        test('Should be immutable and keyed by prop', () => {
            expect(Immutable.is(
                functions.toImmutableKeyedByProp('bar')([{bar: 1}, {bar: 2}]),
                ImMap([[1, {bar: 1}], [2, {bar: 2}]]))).toBeTruthy();
        });
});

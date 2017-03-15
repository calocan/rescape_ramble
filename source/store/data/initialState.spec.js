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

import createInitialState, {toObjectKeyedByGeneratedId} from './initialState'
import config from 'store/data/california/config'
import R from 'ramda'
import {mapPropValueAsIndex} from '../../helpers/functions';

describe('Initial Satate', () => {
    test('toImmutableKeyedById adds an id and keys by it', () => {
        const obj = [
            {
                foo: 'bar'
            },
            {
                foo: 'car'
            }
        ];
        let i = 1;
        function * numbers () {
            while (true) {
                yield (i++).toString();
            }
        };
        expect(toObjectKeyedByGeneratedId(numbers())(obj)).toEqual(
            {
                '1': {
                    id: '1',
                    foo: 'bar',
                },
                '2': {
                    id: '2',
                    foo: 'car',
                },
            }
        )
    });
    test('matchs the current configuration', () => {
        const toObjectKeyedById = mapPropValueAsIndex('id');
        R.map(toObjectKeyedById, config.gtfs)
        expect(createInitialState(config)).toMatchSnapshot();
    })
});
/**
 * Created by Andy Likuski on 2017.06.21
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {createLocalDb, cycleLocalDb, destroy, getDb} from './pouchDbIO';
import * as fs from 'fs';
import {retrieveOrFetch} from './storageIO';
import prettyFormat from 'pretty-format'
import {expectTask} from 'helpers/jestHelpers';
import Maybe from 'data.maybe'
import R from 'ramda-maybe';
import Task from 'data.task';
import {promiseToTask} from 'helpers/functions';

const name = 'storage_io_spec';
const PATH = `${__dirname}/__databases__/`;
const DB = `${PATH}${name}`;
if (!fs.existsSync(PATH))
    fs.mkdirSync(PATH);

describe('storageIO', () => {
    test('retrieveOrFetch Hit', () => {
        const ID = '1';
        expectTask(
            // Cycle the db
            cycleLocalDb(DB)
            // Put a document in the db
            .chain(db => promiseToTask(db.put({ '_id': ID })))
            // Expect to find the document in the db. Make the fetch task return null to indicate a db miss
            .chain(() => retrieveOrFetch(Task.of(null), getDb(DB), ID))
            // Map to Maybe(id)
            .map(documentOrNull => R.prop('_id')(documentOrNull))
        ).resolves.toEqual(Maybe.Just(ID))
    }),
    test('retrieveOrFetch Miss', () => {
        const ID = '1';
        expectTask(
            // Cycle the db
            cycleLocalDb(DB)
            // Put a document in the db with another id
            .chain(db => promiseToTask(db.put({ '_id': '24' })))
            // Expect to fail to find the document and to instead load it from elsewhere (hence Task.of({ '_id': ID}))
            .chain(() => retrieveOrFetch(Task.of({ '_id': ID }), getDb(DB), ID))
            // Map to Maybe(id)
            .map(documentOrNull => {
                return R.prop('_id')(documentOrNull)
            })
        ).resolves.toEqual(Maybe.Just(ID))
    })
})
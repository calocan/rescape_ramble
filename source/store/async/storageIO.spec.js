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

const {createLocalDb, cycleLocalDb, destroy, getDb} = require('./pouchDbIO');
import * as fs from 'fs';
const {retrieveOrFetch} = require('./storageIO');
import prettyFormat from 'pretty-format'
const {expectTask} = require('helpers/jestHelpers');
const Maybe = require('data.maybe');
import {taskToPromise} from "../../helpers/functions";
const R = require('ramda');
const Rm = require('ramda-maybe');
const Task = require('data.task');
const {promiseToTask} = require('helpers/functions');

const name = 'storage_io_spec';
const PATH = `${__dirname}/__databases__/`;
const DB = `${PATH}${name}`;
if (!fs.existsSync(PATH))
    fs.mkdirSync(PATH);

describe('storageIO', () => {
    test('retrieveOrFetch', () => {
        const HIT_ID = '1';
        const MISS_ID = '2';
        expectTask(
            // Cycle the db
            cycleLocalDb(DB).chain(
                // Combine the two separate Tasks into a single Task with both results
                // Array (Task String) ===> (Task (Array String))
                db => R.sequence(Task.of, [
                    // Put a document in the db
                    promiseToTask(db.put({'_id': HIT_ID}))
                        // Expect to find the document in the db. Make the fetch task return null to indicate a db miss
                        .chain(() => retrieveOrFetch(Task.of(null), getDb(DB), HIT_ID))
                        // Map to Maybe(id)
                        .map(documentOrNull => Rm.prop('_id')(documentOrNull)),

                    // Expect to fail to find the document and to instead load it from elsewhere (hence Task.of({ '_id': ID}))
                    retrieveOrFetch(Task.of({'_id': MISS_ID}), getDb(DB), MISS_ID)
                        // Map to Maybe(id)
                        .map(documentOrNull => Rm.prop('_id')(documentOrNull))
                ])
            )
        ).resolves.toEqual([Maybe.Just(HIT_ID), Maybe.Just(MISS_ID)]);
    })
})
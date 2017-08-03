/**
 * Created by Andy Likuski on 2017.06.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {getDb, createLocalDb, createRemoteDb, createRemoteUrl, destroy, startSync, stopSync, logSync} from './pouchDbIO'
import {expectTask, expectTaskRejected} from 'helpers/jestHelpers';
import {promiseToTask} from 'helpers/functions'
import * as fs from 'fs';
import moment from 'moment';
import Task from 'data.task'
const name = 'pouch_db_io_spec';
const PATH = `${__dirname}/__databases__/`;
const DB = `${PATH}${name}`;
const REMOTE_DB_URL = createRemoteUrl(name);
if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH);
}

describe('pouchDbIO', () => {
    test('Create a local pouchdDb', () => {
        const db = createLocalDb(DB);
        // Make sure it's a db
        expectTask(promiseToTask(db.info()).map(response => response.db_name)).resolves.toBe(DB);
        // Make sure we cache it
        expectTask(promiseToTask(getDb(DB).info()).map(response => response.db_name)).resolves.toBe(DB);
    });

    test('Destroy a local pouchdDb', () => {
        createLocalDb(DB);
        expectTaskRejected(destroy(DB)
            .chain(() => {
                return promiseToTask(getDb(DB).info(), true)
            })
        ).rejects.toMatch(Error)
    });

    test('Create a remote pouchdDb', () => {
        expectTask(createRemoteDb(REMOTE_DB_URL)
            .chain(db => promiseToTask(db.info()))
            .map(response => {
                return response.host
            })
        ).resolves.toBe(REMOTE_DB_URL);
    })

    test('Destroy a remote pouchdDb', () => {
        let remoteDb
        expectTaskRejected(createRemoteDb(REMOTE_DB_URL)
            .chain(db => {
                remoteDb = db;
                return destroy(REMOTE_DB_URL)
            })
            // The remoted database should no longer exist
            .chain(response => {
                promiseToTask(remoteDb.info(), true)
            })
        ).rejects.toMatch(Error)
    });

    test('Sync', () => {
        const db = createLocalDb(DB);
        const doc = {
            '_id': moment.now().toString(),
            'name': 'Mittens',
            'occupation': 'kitten',
            'age': 3,
            'hobbies': [
                'playing with balls of yarn',
                'chasing laser pointers',
                "lookin' hella cute"
            ]
        };
        expectTask(promiseToTask(db.put(doc)).chain(
            () => new Task((reject, response) => {
                startSync(db, REMOTE_DB_URL)
                    .on('change', theDoc => {
                        // Wait for the change event from syncing the doc to the remote Db
                        response()
                    })
            }))
            .chain(() => {
                // Retrieve a remote Db reference and wait for it to be ready
                return createRemoteDb(REMOTE_DB_URL)
            })
            .chain(remoteDb => {
                return promiseToTask(remoteDb.get(doc._id));
            })
            .map(retrievedDoc => {
                stopSync(REMOTE_DB_URL);
                return retrievedDoc._id;
            })
        ).resolves.toBe(doc._id);
    })
});

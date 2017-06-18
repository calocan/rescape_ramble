/**
 * Created by Andy Likuski on 2017.06.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import PouchDB from 'pouchb'
import Task from 'db.task'

// A reference to our PouchDb instances keyed by region name
const dbs = {};
const syncs = {};
PouchDB.plugin(require('pouchdb-erase'));

/***
 * Returns the remote URL for the given database
 * @param name
 */
export const createRemoteUrl = name => `http://localhost:5984/${name}`;

export const sync = ({db, remoteUrl}) => {
    return PouchDB.sync(db, remoteUrl, {
        live: true,
        retry: true
    }).on('change', function (info) {
        // handle change
        console.info(`Sync Changed: ${info}`);
    }).on('paused', function (err) {
        // replication paused (e.g. replication up to date, user went offline)
        console.warn(`Sync Paused: ${err}`);
    }).on('active', function () {
        // replicate resumed (e.g. new changes replicating, user went back online)
        console.info('Sync Active');
    }).on('denied', function (err) {
        // a document failed to replicate (e.g. due to permissions)
        console.warn(`Sync Denied: ${err}`);
    }).on('complete', function (info) {
        // handle complete
        console.info(`Sync Completed: ${info}`);
    }).on('error', function (err) {
        console.warn(`Sync Erred: ${err}`);
        // handle error
    });
}

/***
 * Destroy the given database
 * @param dbName
 * @returns {Task}
 */
export function destroy(dbName) {
    return new Task((reject, resolve) => {
        new PouchDB(dbName).destroy().then(function () {
            resolve()
        }).catch(function () {
            reject()
        })
    });
}

export const createDb = regionName => {
    const name = regionName;
    dbs[regionName] = new PouchDB(name);
    return dbs[regionName];
};
export const startSync = (db, regionName) => {
    syncs[regionName] = sync({db, remoteUrl: createRemoteUrl(regionName)});
    return syncs[regionName]
}
export const stopSync = (regionName) => {
    syncs[regionName].cancel()
}
export const getDb = regionName => {
    return dbs[regionName]
}

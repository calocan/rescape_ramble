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
const PouchDB = require('pouchdb');
const Task = require('data.task');

// A reference to our PouchDb instances keyed by region name
const dbs = {};
const syncs = {};
PouchDB.plugin(require('pouchdb-erase'));


/**
 * Creates a local database synchronously. The database is cached so that getDb can access it
 * @param {String} name The database name
 * @returns {Object} The PouchDb instance
 */
const createLocalDb = module.exports.createLocalDb = name => {
    dbs[name] = new PouchDB(name);
    return dbs[name];
};

/**
 * Destroy the given database, either local or remote
 * @param {String} dbNameOrUrl The PouchDb name or Url
 * @returns {Task} The Task to destroy the database
 */
const destroy = module.exports.destroy = function destroy(dbNameOrUrl) {
    return new Task((reject, resolve) => {
        (dbs[dbNameOrUrl] || new PouchDB(dbNameOrUrl)).destroy().then(function () {
            resolve();
        }).catch(e => reject(e));
    });
};

/**
 * Task to Create, destroy, and recreate the given local database. Used for tests
 * @param {String} name The name of the local database to cycle
 * @returns {Task} A Task what responds with the PouchDb
 * cycleLocalDb:: String -> Task Error PouchDb
 */
const cycleLocalDb = module.exports.cycleLocalDb = name => {
    createLocalDb(name);
    return destroy(name).map(() => createLocalDb(name));
};

/**
 * Returns the remote URL for the given database
 * TODO This can't be a local url
 * @param {String} name The name of the database
 * @returns {String} The remote database url
 */
module.exports.createRemoteUrl = name => `http://localhost:5984/${name}/`;

/**
 * Creates a remote database in a Task
 * @param {String} remoteUrl The remote PouchDb url
 * @returns {Task} The task to create the remote Pouch database
 * createRemoteDb:: String -> Task {"error":"not_found","reason":"no_db_file"} PouchDb
 */
module.exports.createRemoteDb = remoteUrl => {
    return new Task((reject, response) => {
        const db = dbs[remoteUrl] = new PouchDB(remoteUrl);
        if (db.error) {
            // Reject is {"error":"not_found","reason":"no_db_file"}
            reject(db);
        } else {
            // info Response contains {"doc_count":0,"update_seq":0,"db_name":"kittens"} and other fields:w
            db.info().then(response(db)).catch(reject);
        }
    });
};

/**
 * Sync a local database with a remote database at the given url.
 * If the remote database does not exist it is created.
 * @param {Object} db The PouchDb instance
 * @param {String} remoteUrl The PouchDb remote url
 * @returns {undefined}
 */
const doSync = module.exports.doSync = ({db, remoteUrl}) => {
    return PouchDB.sync(db, remoteUrl, {
        live: true,
        retry: true
    });
};

/**
 * Add logging to all doSync handlers
 * @param {Object} sync The PouchDb sync object
 * @returns {undefined}
 */
module.exports.logSync = sync =>
    sync.on('change', function (info) {
        // handle change
        // console.info(`Sync Changed: ${prettyFormat(info)}`);
    }).on('paused', function (err) {
        // replication paused (e.g. replication up to date, user went offline)
        // console.warn(`Sync Paused: ${prettyFormat(err)}`);
    }).on('active', function () {
        // replicate resumed (e.g. new changes replicating, user went back online)
        // console.info('Sync Active');
    }).on('denied', function (err) {
        // a document failed to replicate (e.g. due to permissions)
        // console.warn(`Sync Denied: ${prettyFormat(err)}`);
    }).on('complete', function (info) {
        // handle complete
        // console.info(`Sync Completed: ${prettyFormat(info)}`);
    }).on('error', function (err) {
        // console.warn(`Sync Erred: ${prettyFormat(err)}`);
        // handle error
    });


module.exports.startSync = (db, remoteUrl) => {
    syncs[remoteUrl] = doSync({db, remoteUrl});
    return syncs[remoteUrl];
};

module.exports.stopSync = (remoteUrl) => {
    syncs[remoteUrl].cancel();
};

/**
 * Returns cached local and remote PouchDb instances
 * @param {String} nameOrUrl The PouchDb name or url
 * @returns {Object} The PouchDb
 */
module.exports.getDb = nameOrUrl => {
    return dbs[nameOrUrl];
};

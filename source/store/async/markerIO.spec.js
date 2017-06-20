/**
 * Created by Andy Likuski on 2017.04.03
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import PouchDB from 'store/async/pouchDb'
import {removeMarkers, removeMarker, fetchMarkers, fetchMarkersCelled, persistMarkers} from './markerIO';
import {sync, destroy} from './pouchDb'
import {expectTask} from '../../helpers/jestHelpers'
import {PARIS_SAMPLE, LA_SAMPLE} from './markerIO.sample'
import {mergeAllWithKey} from '../../helpers/functions'
import {concatFeatures} from '../../helpers/geojsonHelpers'
import R from 'ramda'

// combine the samples into one obj with concatinated features
const geojson = mergeAllWithKey(concatFeatures)([PARIS_SAMPLE, LA_SAMPLE]);

// TODO use .resolves for all async tests whenever Jest 20 comes out, assuming it works with fork

describe('markerHelpers', () => {

    //PouchDB.debug.enable('*');
    const bounds = require('query-overpass').LA_BOUNDS;
    const path = '__db__/tests/markerHelpers.'
    // const createRemoteUrl = `http://localhost:5984/${name}`;
    // const syncObject = sync({db, createRemoteUrl});

    test('Persist MarkerList', () => {
        const name = 'PersistMarkers';
        const options = {};
        destroy(name);
        const db = new PouchDB(path + name);

        // Populate the db
        expectTask(
            persistMarkers(regionKey, options, geojson.features)
        ).resolves.toEqual(geojson.features);
    });

    test('Query MarkerList', () => {
        const name = 'QueryMarkers';
        const options = {};
        destroy(name);
        const db = new PouchDB(path + name);

        // Query the db
        expectTask(
            persistMarkers(db, options, geojson.features).chain(
                response => fetchMarkers(db, options, bounds)
            ).map(response => response.rows.length)
        ).resolves.toEqual(geojson.features.length);
    });

    test('Remove Marker', () => {
        const name = 'RemoveMarker';
        const options = {};
        destroy(name);
        const db = new PouchDB(path + name);

        expectTask(
                console.log('Persist') || persistMarkers(db, options, geojson.features)
            .chain(
                response => console.log('Fetch') || fetchMarkers(db, {testBounds: bounds}, bounds)
            ).chain(
                response => console.log('Remove') || removeMarker(db, {testBounds: bounds}, R.head(response.rows))
            ).chain(
                response => console.log('Fetch') || fetchMarkers(db, {testBounds: bounds}, bounds)
            ).map(response => R.head(response.rows))
        ).resolves.toEqual(geojson.features.length - 1);
    })
});

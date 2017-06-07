/**
 * Created by Andy Likuski on 2017.04.03
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import PouchDB from 'pouchdb'
import {sync, removeMarkers, fetchMarkers, fetchMarkersCelled, persistMarkers} from './markerHelpers';
import {removeDuplicateObjectsByProp} from 'helpers/functions'
import {expectTask} from './jestHelpers'
import {PARIS_SAMPLE, LA_SAMPLE} from './markerHelpers.sample'
import {mergeAllWithKey} from './functions'
import {concatFeatures} from './geojsonHelpers'

// combine the samples into one obj with concatinated features
const geojson = mergeAllWithKey(concatFeatures)([PARIS_SAMPLE, LA_SAMPLE]);

// TODO use .resolves for all async tests whenever Jest 20 comes out, assuming it works with fork

describe("markerHelpers", () => {

    PouchDB.debug.enable('*');
    const bounds = require('query-overpass').LA_BOUNDS;

    const name = 'markers';
    const remoteUrl = `http://localhost:5984/${name}`;
    const options = {
        cellSize: 200, testBounds: bounds
    };
    const db = new PouchDB(name);
    const syncObject = sync({db, remoteUrl});

    /*
     test("fetchMarkers", () => {
     // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
     expectTask(
     fetchMarkers(db, options, bounds)
     ).resolves.toEqual(require('queryOverpassResponse').LA_SAMPLE)
     });

     test("fetchMarker in cells", () => {
     expectTask(
     fetchMarkersCelled(db, options, bounds)
     ).resolves.toEqual(
     // the sample can have duplicate ids
     removeDuplicateObjectsByProp('id', require('queryOverpassResponse').LA_SAMPLE.features)
     )
     })
     */

    test("Remove Markers", () => {
        // Destroy the db and make sure it's empty
        expectTask(
            removeMarkers(db, options).chain(
                destroySuccess => fetchMarkers({testBounds: bounds}, bounds)
            ).map(response => response.rows.length)
        ).resolves.toBe(0);
    });

    test("Persist Markers", () => {
        // Populate the db
        expectTask(
            persistMarkers(db, options, geojson.features)
        ).resolves.toEqual(geojson.features);
    });

    test("Query Markers", () => {
        // Query the db
        expectTask(
            fetchMarkers(db, {testBounds: bounds}, bounds).map(response => response.rows.length)
        ).resolves.toEqual(geojson.features.length);
    });
});

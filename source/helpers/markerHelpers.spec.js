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

import {removeMarkers, fetchMarkers, fetchMarkersCelled, persistMarkers} from './markerHelpers';
import {removeDuplicateObjectsByProp} from 'helpers/functions'

// TODO use .resolves for all async tests whenever Jest 20 comes out, assuming it works with fork

describe("markerHelpers", ()=>{

    const bounds = require('query-overpass').LA_BOUNDS;
    test("fetchMarkers", () => {
        // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
        expect(new Promise((resolve, reject) => {
            fetchMarkers({testBounds: bounds}, bounds).fork(
                error => reject(error),
                response => resolve(response),
            )
        })).resolves.toEqual(require('queryOverpassResponse').LA_SAMPLE)
    });

    test("fetchMarker in cells", () => {
        expect(new Promise((resolve, reject) => {
            fetchMarkersCelled({cellSize: 200, testBounds: bounds}, bounds).fork(
                error => { reject(error) },
                response => resolve(response.features)
            )
        })).resolves.toEqual(
            // the sample can have duplicate ids
            removeDuplicateObjectsByProp('id', require('queryOverpassResponse').LA_SAMPLE.features)
        )
    })

    test("persistMarkers", () => {
        const geojson = {
            "type": "FeatureCollection",
            "generator": "overpass-ide",
            "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
            "timestamp": "2017-06-05T20:36:58Z",
            "features": [
            {
                "type": "Feature",
                "properties": {
                    "@id": "node/27233097",
                    "STIF:zone": "3",
                    "name": "Asnières-sur-Seine",
                    "official_name": "ASNIERES SUR SEINE",
                    "operator": "SNCF",
                    "railway": "station",
                    "ref:SNCF": "Transilien",
                    "ref:SNCF:Transilien": "J;L",
                    "source": "survey",
                    "uic_ref": "8738113",
                    "wikipedia": "fr:Gare d'Asnières-sur-Seine",
                    "@timestamp": "2016-05-27T08:20:46Z",
                    "@version": "11",
                    "@changeset": "39597830",
                    "@user": "overflorian",
                    "@uid": "125897"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        2.2834758,
                        48.905901
                    ]
                },
                "id": "node/27233097"
            },
            {
                "type": "Feature",
                "properties": {
                    "@id": "node/27233126",
                    "STIF:zone": "2",
                    "alt_name": "Clichy - Levallois-Perret",
                    "name": "Clichy-Levallois",
                    "official_name": "CLICHY LEVALLOIS",
                    "operator": "SNCF",
                    "railway": "station",
                    "source": "survey",
                    "uic_ref": "8738112",
                    "wikipedia": "fr:Gare de Clichy - Levallois",
                    "@timestamp": "2016-01-05T14:09:08Z",
                    "@version": "12",
                    "@changeset": "36381565",
                    "@user": "overflorian",
                    "@uid": "125897"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        2.298139,
                        48.8970901
                    ]
                },
                "id": "node/27233126"
            }
        ]
        };
        // Destroy the db and make sure it's empty
        expect(new Promise((resolve, reject) => {
            removeMarkers(geojson.features).chain(
                destroySuccess => fetchMarkers({testBounds: bounds}, bounds)
            ).fork(
                error => reject(error),
                response => {
                    console(`Should be no rows ${response.rows}`)
                    resolve(response.rows)
                }
            )
        })).resolves.toEqual([]);

        // Populate the db and make sure it's empty
        expect(new Promise((resolve, reject) => {
            persistMarkers(geojson.features).fork(
                error => {
                    reject(error)
                },
                response => resolve(response)
            )
        })).resolves.toEqual(geojson.features);

        // Query the db and make sure it's empty
        expect(new Promise((resolve, reject) => {
            fetchMarkers({testBounds: bounds}, bounds).fork(
                error => {
                    reject(error)
                },
                response => {
                    resolve(response.rows)
                }
            )
        })).resolves.toEqual(geojson.features);
    })
});

/**
 * Created by Andy Likuski on 2017.03.13
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
/**
 * Returns kilometers between location
 * @param {Location} fromLocation the origin Location
 * @param {Location} toLocation the destination Location
 * @returns {number} The distance between the Locations
 */
module.exports.calculateDistance = function calculateDistance(fromLocation, toLocation) {
    const pi = Math.PI / 180,
        cos = Math.cos,
        a = 0.5 - cos((toLocation.lat - fromLocation.lat) * pi) / 2 +
            cos(fromLocation.lat * pi) * cos(toLocation.lat * pi) *
            (1 - cos((toLocation.lon - fromLocation.lon) * pi)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; Earth Radius = 6371 km
};


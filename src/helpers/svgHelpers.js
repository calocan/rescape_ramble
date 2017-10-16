/**
 * Created by Andy Likuski on 2017.06.05
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const R = require('ramda');
const {eMap} = require('helpers/componentHelpers');
const {circle, polygon, polyline, g} = eMap(['circle', 'polygon', 'polyline', 'g']);

/**
 * Inspects a feature and returns its type and projected point representation
 * @param {Object} opt Options sent by the SvgOverlayObject from react-map-gl
 * @param {Object} feature The geojson object from which to resolve points
 * @return {Object} An object with the geometry type and points
 */
const resolveSvgPoints = module.exports.resolveSvgPoints = (opt, feature) => {
    switch (feature.geometry.type) {
        case 'Point':
            return {
                type: feature.geometry.type,
                points: [opt.project(feature.geometry.coordinates)]
            };
        case 'LineString':
            return {
                type: feature.geometry.type,
                points: feature.geometry.coordinates.map(coordinate => opt.project(coordinate))
            };
        case 'Polygon':
            return {
                type: feature.geometry.type,
                points: feature.geometry.coordinates[0].map(coordinate => opt.project(coordinate))
            };
        default:
            throw new Error(`Unexpected geometry type ${feature.geometry.type}`);
    }
};

/**
 * Inspects a feature and returns its type and projected point representation
 * @param {Object} opt Options sent by the SvgOverlayObject from react-map-gl
 * @param {[Object]} features geojson features for which to resolve SVG shapes
 * @returns {ReactElement<P>|CElement<P, T>|ReactSVGElement|DOMElement<P, T>|CElement<P, ClassicComponent<P, ComponentState>>|DetailedReactHTMLElement<P, T>|any} React SVG elements
 */
module.exports.resolveSvgReact = (opt, features) => {
    const pointData = R.map(
        feature => {
            return {
                key: feature.id,
                pointData: resolveSvgPoints(opt, feature)
            };
        },
        features);

    const paths = R.map(({key, thePointData}) => {
        switch (thePointData.type) {
            case 'Point':
                const [cx, cy] = R.head(thePointData.points);
                return circle({key, cx, cy, r: '10', fill: 'red', stroke: 'blue', strokeWidth: '1' });
            case 'LineString':
                return polyline({key, fill: 'none', stroke: 'blue', strokeWidth: '10',
                    points: thePointData.points.map(point => point.join(',')).join(' ')});
            case 'Polygon':
                // TODO might need to remove a last redundant point here
                return polygon({ key, fill: 'red', stroke: 'blue', strokeWidth: '10',
                    points: thePointData.points.map(point => point.join(',')).join(' ')});
            default:
                throw new Error(`Unexpected type ${thePointData.type}`);
        }
    },
    /*
            // I was using this for lines and polygons before. Hopefully the svg shapes work just as well
            // for mapbox
            <path
                key={key}
                style={ {stroke: '#1FBAD6', strokeWidth: 2, fill: 'none'} }
                d={ `M${pointString}` }/>,
        */
    pointData);

    return g(
        paths
    );
};

/**
 * Created by Andy Likuski on 2017.06.08
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const React = require('react');
const {geojsonByType} = require('helpers/geojsonHelpers');
const {IconLayer, WebMercatorViewport} = require('deck.gl');
const DeckGL = require('deck.gl').default;
const rbush = require('rbush');
const R = require('ramda');
const locationIconMapping = require('./locationIconMapping').default;
const PropTypes = require('prop-types');
const e = React.createElement;

const ICON_SIZE = 60;

function getIconName(size) {
    if (size === 0) {
        return '';
    }
    if (size < 10) {
        return `marker-${size}`;
    }
    if (size < 100) {
        return `marker-${Math.floor(size / 10)}0`;
    }
    return 'marker-100';
}

function getIconSize(size) {
    return Math.min(100, size) / 100 * 0.5 + 0.5;
}

class Deck extends React.Component {
    constructor(props) {
        super(props);

        // build spatial index
        this._tree = rbush(9, ['.x', '.y', '.x', '.y']);
        this.state = {
            x: 0,
            y: 0,
            hoveredItems: null,
            expanded: false
        };

        this._updateCluster(props);
    }

    componentWillReceiveProps(nextProps) {
        const markersLens = R.lensPath(['geojson']);
        const widthLens = R.lensPath(['viewport', 'width']);
        const heightLens = R.lensPath(['viewport', 'height']);
        if (R.view(markersLens, this.props) !== R.view(markersLens, nextProps)) {
            this.setState({markers: nextProps.geojson.markers});
            this._updateCluster(nextProps);
        }
        if (
            R.view(widthLens, this.props) !== R.view(widthLens, nextProps) ||
            R.view(heightLens, this.props) !== R.view(heightLens, nextProps)) {
            this._updateCluster(nextProps);
        }
    }


    // Compute icon clusters
    // We use the projected positions instead of longitude and latitude to build
    // the spatial index, because this particular dataset is distributed all over
    // the world, we can't use some fixed deltaLon and deltaLat
    _updateCluster({ viewport, geojson }) {
        const data = geojson;
        if (!data.features.length) {
            return;
        }

        const tree = this._tree;

        const transform = new WebMercatorViewport(R.merge(viewport, {
            zoom: 0
        }));

        data.features.forEach(p => {
            const screenCoords = transform.project(p.geometry.coordinates);
            p.x = screenCoords[0];
            p.y = screenCoords[1];
            p.zoomLevels = [];
        });

        tree.clear();
        tree.load(data.features);

        for (let z = 0; z <= 20; z++) {
            const radius = ICON_SIZE / 2 / Math.pow(2, z);

            data.features.forEach(p => {
                if (typeof (p.zoomLevels[z]) === 'undefined') {
                    // this point does not belong to a cluster
                    const {x, y} = p;

                    // find all points within radius that do not belong to a cluster
                    const neighbors = tree.search({
                        minX: x - radius,
                        minY: y - radius,
                        maxX: x + radius,
                        maxY: y + radius
                    })
                        .filter(neighbor => typeof (neighbor.zoomLevels[z]) === 'undefined');

                    // only show the center point at this zoom level
                    neighbors.forEach(neighbor => {
                        if (neighbor === p) {
                            p.zoomLevels[z] = {
                                icon: getIconName(neighbors.length),
                                size: getIconSize(neighbors.length),
                                points: neighbors
                            };
                        } else {
                            neighbor.zoomLevels[z] = null;
                        }
                    });
                }
            });
        }
    }

    render() {
        const {viewport, iconAtlas, showCluster, geojson, onHover, onClick} = this.props;

        const z = Math.floor(viewport.zoom);
        const size = showCluster ? 1 : Math.min(Math.pow(1.5, viewport.zoom - 10), 1);
        const updateTrigger = {z: z * showCluster};

        const layers = geojson.features.length ? [new IconLayer({
            id: 'icon',
            data: geojson.features,
            pickable: true,
            iconAtlas,
            iconMapping: locationIconMapping,
            sizeScale: ICON_SIZE * size * window.devicePixelRatio,
            getPosition: d => d.geometry.coordinates,
            getIcon: d => showCluster ? (d.zoomLevels[z] && d.zoomLevels[z].icon) : 'marker',
            getSize: d => showCluster ? (d.zoomLevels[z] && d.zoomLevels[z].size) : 1,
            onHover: onHover,
            onClick: onClick,
            updateTriggers: {
                getIcon: updateTrigger,
                getSize: updateTrigger
            }
        })] : [];

        return e(DeckGL, R.merge(viewport, {
            layers,
            iconAtlas,
            showCluster,
            locationIconMapping,
            debug: true
        }));
    }
}

const {
    number,
    string,
    object,
    bool,
    array,
    func
} = PropTypes;

Deck.propTypes = {
    viewport: object.isRequired,
    geojson: object.isRequired,
    showCluster: func.isRequired,
    onHover: func.isRequired,
    onClick: func.isRequired,
    iconAtlas: string.isRequired
};
module.exports.default = Deck;

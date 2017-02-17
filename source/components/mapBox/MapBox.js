/**
 * Created by Andy Likuski on 2017.02.16
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {PropTypes, Component} from 'react';
import MapGL from 'react-map-gl';
import autobind from 'react-autobind'
import Immutable from 'immutable';
import window from 'global/window';
import styles from './MapBox.style';

import config from 'config.json';
// Hoping to use maxBounds like in the react-mapbox-gl lib
const { mapboxApiAccessToken, style, maxBounds, center, zoom, pitch, bearing } = config;
import SF_FEATURE from 'store/data/feature-example-sf.json';

function buildStyle({fill = 'red', stroke = 'blue'}) {
    return Immutable.fromJS({
        version: 8,
        name: 'Example raster tile source',
        sources: {
            'my-geojson-polygon-source': {
                type: 'geojson',
                data: SF_FEATURE
            }
        },
        layers: [
            {
                id: 'geojson-polygon-fill',
                source: 'my-geojson-polygon-source',
                type: 'fill',
                paint: {'fill-color': fill, 'fill-opacity': 0.4},
                interactive: true
            }, {
                id: 'geojson-polygon-stroke',
                source: 'my-geojson-polygon-source',
                type: 'line',
                paint: {'line-color': stroke, 'line-width': 4},
                interactive: false
            }
        ]
    });
}

const propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};

export default class MapBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                latitude: center.latitude,
                longitude: center.longitude,
                zoom: zoom,
                bearing: bearing,
                pitch: pitch,
                startDragLngLat: null,
                isDragging: false
            },
            mapStyle: style //buildStyle({stroke: '#FF00FF', fill: 'green'})
        };
        autobind(this);
    }

    _onChangeViewport(opt) {
        this.setState({viewport: opt});
    }

    _onClickFeatures(features) {
        window.console.log(features);
    }

    render() {
        const viewport = {
            mapStyle: this.state.mapStyle,
            // The map's viewport properties as mirrored in the Component state
            ...this.state.viewport,
            // Width, height, float. The passed in props from the parent take priority over Component's default style
            ...styles.container,
            ...this.props
        };
        return (
            <MapGL
                { ...viewport }
                onChangeViewport={ this._onChangeViewport }
                onClickFeatures={ this._onClickFeatures }
                perspectiveEnabled={ true }
                // setting to `true` should cause the map to flicker because all sources
                // and layers need to be reloaded without diffing enabled.
                preventStyleDiffing={ false }
                mapboxApiAccessToken={mapboxApiAccessToken}
            />
        );
    }
}

MapBox.propTypes = propTypes;

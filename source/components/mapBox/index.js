import React, {PropTypes, Component} from 'react';
import MapGL from 'react-map-gl';
import autobind from 'react-autobind'
import Immutable from 'immutable';
import window from 'global/window';
import styles from './index.style';

import config from "../../config.json";
const { accessToken, style, maxBounds, center, zoom, pitch, bearing } = config;


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
            ...this.state.viewport,
            // The props can override the styles, but why would they
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
                mapboxApiAccessToken={accessToken}
            />
        );
    }
}

MapBox.propTypes = propTypes;

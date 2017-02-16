import React, {PropTypes, Component} from 'react';
import MapGL from 'react-map-gl';
import autobind from 'react-autobind'
import Immutable from 'immutable';
import window from 'global/window';
import styles from './index.style';

import config from 'config.json';
// Hoping to use maxBounds like in the react-mapbox-gl lib
const { mapboxApiAccessToken, style, maxBounds, center, zoom, pitch, bearing } = config;
import SF_FEATURE from '../../data/feature-example-sf.json';

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

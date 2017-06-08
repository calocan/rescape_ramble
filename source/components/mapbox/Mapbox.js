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

import MapGL from 'react-map-gl';
import React from 'react'
import autobind from 'autobind-decorator';
import createMapStops from 'components/mapStop/mapStops';
import MapLines from 'components/mapLine/MapLines';
import MapMarkers from 'components/mapMarker/MapMarkers';
import {getPath} from 'helpers/functions'
import {featuresByType, geojsonByType} from 'helpers/geojsonHelpers'
const MapStops = createMapStops(React);
import R from 'ramda';
import styles from './Mapbox.style.js';

class Mapbox extends React.Component {

    componentWillReceiveProps(nextProps) {
        const osmLens = R.lensPath(['geojson', 'osm', 'features', 'length']);
        const markersLens = R.lensPath(['geojson', 'markers']);
        // Features have changed
        if (R.view(osmLens, this.props) != R.view(osmLens, nextProps))
            this.setState({osmByType: geojsonByType(nextProps.geojson.osm)});
        if (R.view(markersLens, this.props) != R.view(markersLens, nextProps))
            this.setState({markersByType: featuresByType(nextprops.geojson.markers)});
    }

    @autobind
    _onChangeViewport(opt) {
        this.props.onChangeViewport(opt);
    }

    render() {
        const { viewport, mapboxApiAccessToken } = this.props;
        const {node, way} = getPath(['state', 'osmByType'], this) || {}
        const markers = getPath(['state', 'markersByType'], this) || {}

        return (
            <MapGL
                style={styles.container}
                mapboxApiAccessToken = { mapboxApiAccessToken }
                { ...viewport }
                showZoomControls={ true }
                perspectiveEnabled={ true }
                // setting to `true` should cause the map to flicker because all sources
                // and layers need to be reloaded without diffing enabled.
                preventStyleDiffing={ false }
                onChangeViewport={this._onChangeViewport}
            >
                <MapStops geojson={node || {}} viewport={viewport}/>
                <MapLines geojson={way || {}} viewport={viewport}/>
                <MapMarkers markers={markers || {}} viewport={viewport}/>
            </MapGL>
        );
    }
};

const {
    number,
    string,
    object,
    bool
} = React.PropTypes;

Mapbox.propTypes = {
    viewport: object.isRequired,
    mapboxApiAccessToken: string.isRequired,
    geojson: object.isRequired,
};

export default Mapbox;



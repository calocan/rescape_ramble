/**
 * Created by Andy Likuski on 2017.02.16
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';
import React from 'react';
import createMapStops from 'components/mapStop/mapStops';
import MapMarkers from 'components/mapMarker/MapMarkers';
import {getPath} from 'helpers/functions';
import {geojsonByType} from 'helpers/geojsonHelpers';
import Deck from './Deck';
import R from 'ramda';
import styles from './Mapbox.style.js';
const MapStops = createMapStops(React);

class Mapbox extends React.Component {

    componentWillReceiveProps(nextProps) {
        const osmLens = R.lensPath(['geojson', 'osm', 'features', 'length']);
        const markersLens = R.lensPath(['geojson', 'markers']);
        const widthLens = R.lensPath(['viewport', 'width']);
        const heightLens = R.lensPath(['viewport', 'height']);
        // Features have changed
        if (R.view(osmLens, this.props) !== R.view(osmLens, nextProps)) {
            this.setState({osmByType: geojsonByType(nextProps.geojson.osm)});
        }
        if (R.view(markersLens, this.props) !== R.view(markersLens, nextProps)) {
            this.setState({markers: nextProps.geojson.markers});
        }
    }

    render() {
        const { viewport, mapboxApiAccessToken, iconAtlas, showCluster, hoverMarker, selectMarker } = this.props;
        const {node, way} = getPath(['state', 'osmByType'], this) || {};
        const markers = {type: 'FeatureCollection', features: getPath(['state', 'markers'], this) || []};

        //<MapStops geojson={node || {}} viewport={viewport}/>,
        //<MapLines geojson={way || {}} viewport={viewport}/>,
        const mapMarkers = <MapMarkers geojson={markers} viewport={viewport} regionId={this.props.region.id}/>
        const deck = <Deck
            viewport={viewport} geojson={markers} iconAtlas={iconAtlas} showCluster={showCluster}
            onHover={hoverMarker} onClick={selectMarker}
        />

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
                onChangeViewport={this.props.onChangeViewport}
            >
                {deck}
            </MapGL>
        );
    }
}

const {
    number,
    string,
    object,
    bool
} = PropTypes;

Mapbox.propTypes = {
    viewport: object.isRequired,
    mapboxApiAccessToken: string.isRequired,
    geojson: object.isRequired,
    iconAtlas: string.isRequired,
    showCluster: bool.isRequired,
};

export default Mapbox;



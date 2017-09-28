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

const PropTypes = require('prop-types');
const MapGL = require('react-map-gl');
const React = require('react');
const createMapStops = require('components/mapStop/mapStops').default;
const MapMarkers = require('components/mapMarker/MapMarkers').default;
const {reqPath} = require('rescape-ramda').throwing;
const {geojsonByType} = require('helpers/geojsonHelpers');
const Deck = require('./Deck').default;
const R = require('ramda');
const styles = require('./Mapbox.style').default;
const MapStops = createMapStops(React);
const e = React.createElement;

class Mapbox extends React.Component {
    componentWillReceiveProps(nextProps) {
        const osmLens = R.lensPath(['region', 'geojson', 'osm', 'features', 'length']);
        const markersLens = R.lensPath(['region', 'geojson', 'markers']);
        // Features have changed
        if (R.view(osmLens, this.props) !== R.view(osmLens, nextProps)) {
            this.setState({osmByType: geojsonByType(nextProps.region.geojson.osm)});
        }
        if (R.view(markersLens, this.props) !== R.view(markersLens, nextProps)) {
            this.setState({markers: nextProps.region.geojson.markers});
        }
    }

    render() {
        const { viewport, mapboxApiAccessToken, iconAtlas, showCluster, hoverMarker, selectMarker } = this.props;
        const {node, way} = reqPath(['state', 'osmByType'], this) || {};
        const markers = {type: 'FeatureCollection', features: reqPath(['state', 'markers'], this) || []};

        // <MapStops geojson={node || {}} viewport={viewport}/>,
        // <MapLines geojson={way || {}} viewport={viewport}/>,
        const mapMarkers = e(MapMarkers, {
            geojson: markers,
            viewport,
            regionId: this.props.region.id
        });
        const deck = e(Deck, {
            viewport,
            geojson: markers,
            iconAtlas,
            showCluster,
            onHover: hoverMarker,
            onClick: selectMarker
        });

        return e(MapGL, R.merge(viewport, {
            mapboxApiAccessToken,
            showZoomControls: true,
            perspectiveEnabled: true,
            // setting to `true` should cause the map to flicker because all sources
            // and layers need to be reloaded without diffing enabled.
            preventStyleDiffing: false,
            onChangeViewport: this.props.onChangeViewport
        }),
            deck
        );
    }
}

const {
    number,
    string,
    object,
    bool,
    func
} = PropTypes;

Mapbox.propTypes = {
    style: object.isRequired,
    viewport: object.isRequired,
    mapboxApiAccessToken: string.isRequired,
    iconAtlas: string.isRequired,
    showCluster: bool.isRequired,
    region: object.isRequired,
    hoverMarker: func.isRequired,
    selectMarker: func.isRequired,
    onChangeViewport: func.isRequired
};

module.exports.default = Mapbox;



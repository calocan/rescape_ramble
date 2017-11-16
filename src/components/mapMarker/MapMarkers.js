/**
 * Created by Andy Likuski on 2017.04.26
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {DraggablePointsOverlay, SVGOverlay} = require('react-map-gl');
const PropTypes = require('prop-types');
const React = require('react');
const R = require('ramda');
const {resolveSvgReact} = require('helpers/svgHelpers');
const e = React.createElement;
const ENTER_KEY = 13;
const LIGHT_SETTINGS = {
    lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
    ambientRatio: 0.2,
    diffuseRatio: 0.5,
    specularRatio: 0.3,
    lightsStrength: [1.0, 0.0, 2.0, 0.0],
    numberOfLights: 2
};

class MapMarkers extends React.Component {
    /**
     * Called when SVG neeeds to be redrawn
     * @param {Object} opt Options from React SVG Shapes
     * @returns {undefined}
     * @private
     */
    _redrawSVGOverlay(opt) {
        if (!this.props.geojson || !this.props.geojson.features) {
            return null;
        }
        return resolveSvgReact(opt, this.props.geojson.features);
    }

    /**
     * Called when a marker is added
     * @param {Object} value The geojson Marker
     * @returns {undefined}
     */
    markerAdded(value) {
        this.markerUpdated(value);
    }

    /**
     * Called when a marker changes
     * @param {Object} event The javscript event
     * @returns {undefined}
     */
    markerChanged(event) {
        this.markerUpdated(event.target.value);
    }

    /**
     * Update or creates a new marker as a geojson Feature and persists it
     * @param {Object} value The Marker geojson
     * @param {String} value.name The name of the marker
     * @param {String} value.id The id of the marker
     * @param {Array} value.location The lon, lat pair of the marker
     * @returns {undefined}
     */
     markerUpdated(value) {
        const id = `node/${value.id}`;
        const marker = {
            _id: value.id,
            type: 'Feature',
            properties: {
                '@id': id,
                name: `${value.name}`
            },
            geometry: {
                type: 'Point',
                coordinates: value.location
            },
            id: id
        };
        this.props.updateMarkers({}, [marker]);
    }

    /**
     * Show the Markers
     * @returns {undefined}
     */
    showMarkers() {
        this.props.fetchMarkers({});
    }

    /**
     * Marker clicked to edit the name
     * @param {Object} marker The geojson Marker
     * @returns {undefined}
     */
    markerClicked(marker) {
        // TODO
        /*
        const div = document.getElementById('li_' + marker.id);
        const inputEditTodo = document.getElementById('input_' + marker.id);
        div.className = 'editing';
        inputEditTodo.focus();
        */
    }

    /**
     *
     * The input box when editing a marker has blurred, we should save
     * the new marker or delete the marker if the name is empty
     * @param {Object} marker The geojson Marker
     * @param {Object} event The javascript event
     * @returns {undefined}
    */
    markerBlurred(marker, event) {
        // TODO
        /*
        const trimmedText = event.target.value.trim();
        if ( !trimmedText) {
            db.remove(marker);
        } else {
            marker.name = trimmedText;
            db.put(marker);
        }
        */
    }

    /**
     *
     * If they press enter while editing the name, blur it to trigger save (or delete)
     * @param {Object} marker The geojson Marker
     * @param {Object} event The javascript event
     * @returns {undefined}
     */
    markerKeyPressed(marker, event) {
        // TODO
        /*
        if (event.keyCode === ENTER_KEY) {
            const inputEditTodo = document.getElementById('input_' + todo._id);
            inputEditTodo.blur();
        }
        */
    }

    render() {
        return e(SVGOverlay, R.merge(this.props.viewport, {
            className: 'map-markers',
            key: 'svg-overlay',
            redraw: this._redrawSVGOverlay.bind(this)
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

MapMarkers.propTypes = {
    viewport: object.isRequired,
    geojson: object.isRequired,
    updateMarkers: func.isRequired,
    fetchMarkers: func.isRequired
};
module.exports.default = MapMarkers;


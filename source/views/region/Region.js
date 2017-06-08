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
import Mapbox from 'components/mapbox/MapboxContainer';
import MarkerList from 'components/marker/MarkerListContainer';
import styles from './Region.style.js';
import R from 'ramda';
import React from 'react';
import {getPath} from 'helpers/functions'

/***
 * The View for a Region, such as California. Theoretically we could display multiple regions at once
 * if we had more than one, or we could have a zoomed in region of California like the Bay Area.
 */
class Region extends React.Component {

    componentWillReceiveProps(nextProps) {
        const getRegionId = getPath(['region', 'id'])
        if (
            !(R.equals(...R.map(getRegionId, [this.props, nextProps]))) || // Region changed
            !getPath(['region', 'geojson', 'osmRequested'], nextProps) // or geojson not yet requested
        ) {
            // TODO query_overpass is currently broken
            if (false)
            this.props.fetchOsm(nextProps.settings.overpass, nextProps.region.geospatial.bounds).fork(
                error => this.props.fetchOsmFailure(error),
                osm => {
                    // osm was set in store by action
                }
            );
        }
        if (
            !(R.equals(...R.map(getRegionId, [this.props, nextProps]))) || // Region changed
            !getPath(['region', 'geojson', 'markersRequested'], nextProps) // or markers not yet requested
        ) {
            this.props.fetchMarkers({}, nextProps.region.id).fork(
                error => this.props.fetchMarkersFailure(error),
                markers => {
                    // markers was set in store by action
                }
            );
        }
    }

    render() {
        // applies parent container width/height to mapboxContainer width/height
        const multiplyByPercent = R.compose((percent, num) => num * parseFloat(percent) / 100.0);
        const styleMultiplier = prop => R.apply(multiplyByPercent, R.map(R.prop(prop), [styles.mapboxContainer, this.props.style]));
        return (
            <div className='region' style={R.merge(this.props.style, styles.container)}>
                {/* We additionally give Mapbox the container width and height so the map can track changes to these
                    We have to apply the width and height fractions of this container to them.
                */}
                <div className='mapboxContainer' style={styles.mapboxContainer}>
                    <Mapbox region={this.props.region} style={{
                        width: styleMultiplier('width'),
                        height: styleMultiplier('height')
                    }} />
                </div>
                <div className='markersContainer' style={styles.markersContainer}>
                    <MarkerList region={this.props.region} accessToken={this.props.accessToken} />
                </div>
            </div>
        );
    }
};

/***
 * Expect the region
 * @type {{region: *}}
*/
const {
    string, object, number, func
} = React.PropTypes;
Region.propTypes = {
    settings: object.isRequired,
    region: object.isRequired,
    style: object.isRequired,
    accessToken: string.isRequired
};

export default Region;

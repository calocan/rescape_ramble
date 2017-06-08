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

import React from 'react'
import autobind from 'autobind-decorator';
import {getPath} from 'helpers/functions'
import {geojsonByType} from 'helpers/geojsonHelpers'
import {AddMarkerItem, MarkerItem} from './MarkerItem'
import R from 'ramda';

class MarkerList extends React.Component {

    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        const markersLens = R.lensPath(['geojson', 'markers', 'features', 'length']);
        const dbLens = R.lensProp('db')
        // Features have changed
        if (R.view(markersLens, this.props) != R.view(markersLens, nextProps))
            this.setState({markersByType: geojsonByType(nextProps.geojson.markers)});
        // db is configured
        if (R.view(dbLens, this.props) != R.view(dbLens, nextProps)) {
            nextProps.db.changes({
                since: 'now',
                live: true
            }).on('change', showTodos);
        }
    }

    render() {
        const markers = getPath(['state', 'markersByType'], this) || {}
        const markerItems = R.map(
            marker => <MarkerItem key={marker.properties.id} accessToken={this.props.accessToken} {...R.pick(['name', 'id'], marker.properties)} />,
            markers.features || []);

        return (
            <div className="marker-list">
                <div className="add-marker-item-container">
                    <AddMarkerItem/>
                </div>
                {markerItems}
            </div>
        );
    }
};

const {
    number,
    string,
    object,
    bool
} = React.PropTypes;

MarkerList.propTypes = {
    geojson: object.isRequired,
    accessToken: string.isRequired
};

export default MarkerList;



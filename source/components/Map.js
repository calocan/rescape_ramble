/**
 * Created by Andy Likuski on 2016.12.15
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
import styles from './london-cycle.style'
import {parseString} from 'xml2js'

function getCycleStations() {
    return fetch('https://tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml')
        .then(res => res.text())
        .then(data => {
            return new Promise((resolve, reject) => {
                parseString(data, (err, res) => {
                    if (!err) {
                        resolve(res.stations.station);
                    } else {
                        reject(err);
                    }
                });
            });
        })
}

const maxBounds = [
    [-0.481747846041145, 51.3233379650232],  // South West
    [0.23441119994140536, 51.654967740310525],  // North East
];

export default class Map extends Component {

    state = {
        center: [-0.109970527, 51.52916347],
        zoom: [11],
        skip: 0,
        stations: new Map(),
        popupShowLabel: true
    };

    componentWillMount() {
        getCycleStations().then(res => {
            this.setState(({ stations }) => ({
                stations: stations.merge(res.reduce((acc, station) => {
                    return acc.set(station.id[0], new Map({
                        id: station.id[0],
                        name: station.name[0],
                        position: [ parseFloat(station.long[0]), parseFloat(station.lat[0]) ],
                        bikes: parseInt(station.nbBikes[0]),
                        slots: parseInt(station.nbDocks[0])
                    }))
                }, new Map()))
            }));
        });
    }

    _markerClick = (station, { feature }) => {
        this.setState({
            center: feature.geometry.coordinates,
            zoom: [14],
            station
        });
    };

    _onDrag = () => {
        if (this.state.station) {
            this.setState({
                station: null
            });
        }
    };

    _onToggleHover(cursor, { map }) {
        map.getCanvas().style.cursor = cursor;
    }

    _onControlClick = (map, zoomDiff) => {
        const zoom = map.getZoom() + zoomDiff;
        this.setState({ zoom: [zoom] });
    };

    _popupChange(popupShowLabel) {
        this.setState({ popupShowLabel });
    }

    toggle = true;

    _onFitBoundsClick = () => {
        if (this.toggle) {
            this.setState({
                fitBounds: [[-0.122555629777, 51.4734862092], [-0.114842, 51.50621]]
            });
        } else {
            this.setState({
                fitBounds: [[32.958984, -5.353521], [43.50585, 5.615985]] // this won't focus on the area as there is a maxBounds
            });
        }

        this.toggle = !this.toggle;
    };

    render() {
        const { stations, station, popupShowLabel, fitBounds } = this.state;
        // TODO These are not defined
        const style = null,
            accessToken = null

        return (
            <div>
                <ReactMapboxGl
                    style={style}
                    fitBounds={fitBounds}
                    center={this.state.center}
                    zoom={this.state.zoom}
                    minZoom={8}
                    maxZoom={15}
                    maxBounds={maxBounds}
                    accessToken={accessToken}
                    onDrag={this._onDrag}
                    containerStyle={styles.container}>

                    <ZoomControl
                        zoomDiff={1}
                        onControlClick={this._onControlClick}/>

                    <Layer
                        type='symbol'
                        id='marker'
                        layout={{ 'icon-image': 'marker-15' }}>
                        {
                            stations
                                .map((aStation) => (
                                    <Feature
                                        key={aStation.get('id')}
                                        onHover={this._onToggleHover.bind(this, 'pointer')}
                                        onEndHover={this._onToggleHover.bind(this, '')}
                                        onClick={this._markerClick.bind(this, aStation)}
                                        coordinates={aStation.get('position')}/>
                                )).toArray()
                        }
                    </Layer>

                    {
                        station && (
                            <Popup
                                key={station.get('id')}
                                coordinates={station.get('position')}>
                                <div>
                  <span style={{
                      ...styles.popup,
                      display: popupShowLabel ? 'block' : 'none'
                  }}>
                    {station.get('name')}
                  </span>
                                    <div onClick={this._popupChange.bind(this, !popupShowLabel)}>
                                        {
                                            popupShowLabel ? 'Hide' : 'Show'
                                        }
                                    </div>
                                </div>
                            </Popup>
                        )
                    }
                </ReactMapboxGl>
                {
                    station && (
                        <div style={styles.stationDescription}>
                            <p>{ station.get('name') }</p>
                            <p>{ station.get('bikes') } bikes / { station.get('slots') } slots</p>
                        </div>
                    )
                }
                <div style={{
                    ...styles.btnWrapper,
                    ...(station && styles.btnStationOpen)
                }}>
                    <button style={styles.btn} onClick={this._onFitBoundsClick}>Fit to bounds</button>
                </div>
            </div>
        )
    }
}


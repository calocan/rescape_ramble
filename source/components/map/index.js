import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from 'react-mapbox-gl';
import styles from './index.style';
import { parseString } from 'xml2js';
import { Map } from 'immutable';
import config from '../../config.json';

const { accessToken, style } = config;

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
    [-125, 31],  // South West
    [-113, 43],  // North East
];

export default class LondonCycle extends Component {

  state = {
    center: [-119, 37],
    zoom: [3],
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
        fitBounds: [[-124, 32], [-114, 42]]
      });
    } else {
      this.setState({
        fitBounds: [[-124, 32], [-114, 42]]
      });
    }

    this.toggle = !this.toggle;
  };

  render() {
    const { stations, station, popupShowLabel, fitBounds } = this.state

    return (
      <div>
        <ReactMapboxGl
          style={style}
          fitBounds={fitBounds}
          center={this.state.center}
          zoom={this.state.zoom}
          minZoom={1}
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

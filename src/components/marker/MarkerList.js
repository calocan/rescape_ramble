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

const React = require('react');
const {reqPath} = require('rescape-ramda').throwing;
const {AddMarkerItem, MarkerItem} = require('./MarkerItem');
const R = require('ramda');
const styles = require('./MarkerList.style').default;
const Geocode = require('components/geocode/Geocode').default;
const ScrollArea = require('react-scrollbar');
const PropTypes = require('prop-types');
const e = React.createElement;

class MarkerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationFeature: {}
        };
    }
    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        const markersLens = R.lensPath(['geojson', 'markers']);
        const dbLens = R.lensProp('db');
        // Features have changed
        if (R.view(markersLens, this.props) !== R.view(markersLens, nextProps)) {
            this.setState({markers: nextProps.geojson.markers});
        }
        // db is configured
        if (R.view(dbLens, this.props) !== R.view(dbLens, nextProps)) {
            nextProps.db.changes({
                since: 'now',
                live: true
            // TODO do something on change
            }).on('change', () => {});
        }
    }

    onSelect(locationFeature) {
        this.setState({ locationFeature: locationFeature });
    }

    render() {
        const markers = reqPath(['state', 'markers'], this) || [];
        const markerItems = R.map(
            marker => e(MarkerItem, {
                regionId: this.props.id,
                key: marker.id,
                locationFeature: marker,
                removeMarkers: this.props.removeMarkers
            }),
            markers || []);

        return (
            e('div', {
                className: 'marker-list',
                style: styles.container
            },
                e('div', {
                    style: styles.instructionsLabel
                }, 'Choose a location and enter a name. Press enter on the name to submit'),
                e('div', {
                    className: 'add-marker-container',
                    style: styles.addMarkerContainer
                },
                    e('div', {
                        className: 'geocoder-container',
                        style: styles.geocoderContainer
                    },
                        e(Geocode, {
                            onSelect: this.onSelect.bind(this),
                            search: this.props.searchLocation,
                            searchFailure: this.props.searchLocationFailure,
                            accessToken: this.props.accessToken
                        })
                    ),
                    e('div', {
                        className: 'add-marker-item-container',
                        style: styles.addItemContainer
                    },
                        e(AddMarkerItem, {
                            regionId: this.props.id,
                            locationFeature: this.state.locationFeature,
                            updateMarkers: this.props.updateMarkers
                        })
                    ),
                ),
                e(ScrollArea, {
                    speed: 0.8,
                    className: 'marker-tims-scoll-area',
                    contentClassName: 'content',
                    contentStyle: {height: '100%'},
                    horizontal: false,
                    style: styles.scrollContainer
                },
                    e('div', {
                        className: 'marker-items-container',
                        style: styles.itemsContainer
                        },
                        markerItems
                    )
                )
            )
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

MarkerList.propTypes = {
    geojson: object.isRequired,
    accessToken: string.isRequired,
    // Region id
    id: string.isRequired,
    db: object.isRequired,
    removeMarkers: func.isRequired,
    updateMarkers: func.isRequired,
    searchLocation: func.isRequired,
    searchLocationFailure: func.isRequired
};

module.exports.default = MarkerList;



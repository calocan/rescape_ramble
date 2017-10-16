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
const PropTypes = require('prop-types');
const styles = require('./MarkerItem.style').default;
const moment = require('moment');
const R = require('ramda');
const e = React.createElement;

class MarkerItem extends React.Component {
    _handleRemove() {
        this.props.removeMarkers({}, this.props.regionId, [this.props.locationFeature]).fork(
            () => {
                // console.error('Error removing marker');
            },
            () => {
            }
        );
    }

    render() {
        return (
            e('div', {
                className: 'marker-container',
                style: styles.container
            },
                e('div', {
                    className: 'marker-name',
                    style: styles.nameContainer
                },
                    this.props.locationFeature.properties.name),
                e('div', {
                    className: 'marker-location-name',
                    style: styles.locationContainer
                },
                    this.props.locationFeature.place_name || this.props.locationFeature.geometry.coordinates),
                e('div', {
                    className: 'remove',
                    style: styles.removeContainer,
                    onClick: this._handleRemove.bind(this)
                },
                    'x'
                )
            )
        );
    }
}

class AddMarkerItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            warn: false
        };
    }

    _handleKeyPress(ev) {
        if (ev.key === 'Enter') {
            if (this.props.locationFeature.geometry && this.textInput.value) {
                this.setState({warn: false});
                const id = `node/${moment.now()}`;
                const marker = R.merge(this.props.locationFeature, {
                    id,
                    _id: id,
                    type: 'Feature',
                    properties: {
                        name: this.textInput.value
                    }
                });
                this.props.updateMarkers({}, this.props.regionId, [marker]).fork(
                    () => {
                        // console.error('Error adding marker');
                    },
                    () => {
                        this.textInput.value = null;
                    }
                );
            } else {
                // Warn user to set a location
                this.setState({warn: true});
            }
            // console.log('do validate');
        }
    }

    render() {
        return e('div', {
            className: 'add-marker-container',
            style: styles.container
        },
            e('div', { style: styles.nameLabel }, 'Name'),
            e('input', {
                className: 'add-marker',
                style: styles.addNameContainer,
                onKeyPress: this._handleKeyPress.bind(this),
                ref: (input) => {
 this.textInput = input;
}
            }),
            e('div', R.merge(styles.warnContainer, {
                ref: 'warn',
                className: 'warn',
                style: {
                    display: this.state.warn ? 'block' : 'none'
                }
            }),
               'Please select a location, enter a name, and click enter on the name.'
            )
        );
    }
}

const {
    number,
    string,
    object,
    bool,
    arrayOf,
    func
} = PropTypes;

MarkerItem.propTypes = {
    locationFeature: object.isRequired,
    regionId: string.isRequired,
    removeMarkers: func.isRequired
};

AddMarkerItem.propTypes = {
    locationFeature: object.isRequired,
    coordinates: arrayOf(number),
    regionId: string.isRequired,
    updateMarkers: func.isRequired
};

module.exports = {MarkerItem, AddMarkerItem};

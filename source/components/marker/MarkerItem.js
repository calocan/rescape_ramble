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

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import styles from './MarkerItem.style.js';
import moment from 'moment';
import R from 'ramda';

export class MarkerItem extends React.Component {

    @autobind
    _handleRemove() {
        this.props.removeMarkers({}, this.props.regionId, [this.props.locationFeature]).fork(
            () => {
                console.error('Error removing marker')
            },
            () => {
            }
        );
    }

    render() {
        return (
            <div className='marker-container' style={styles.container}>
                <div className='marker-name' style={styles.nameContainer}>{this.props.locationFeature.properties.name}</div>
                <div className='marker-location-name' style={styles.locationContainer}>
                    {this.props.locationFeature.place_name || this.props.locationFeature.geometry.coordinates}
                </div>
                <div className='remove' style={styles.removeContainer}
                     onClick={this._handleRemove}
                >
                    x
                </div>
            </div>
        );
    }
}

export class AddMarkerItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            warn: false
        }
    }

    @autobind
    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (this.props.locationFeature.geometry && this.textInput.value) {
                this.setState({'warn': false});
                const id = `node/${moment.now()}`
                const marker = R.merge(this.props.locationFeature, {
                    id,
                    _id: id,
                    type: 'Feature',
                    properties: {
                        name: this.textInput.value
                    },
                });
                this.props.updateMarkers({}, this.props.regionId, [marker]).fork(
                    () => {
                        console.error('Error adding marker')
                    },
                    () => {
                        this.textInput.value = null;
                    }
                );
            }
            else {
                // Warn user to set a location
                this.setState({'warn': true});
            }
            console.log('do validate');
        }
    }

    render() {
        return (
            <div className='add-marker-container' style={styles.container}>
                <div style={styles.nameLabel}>Name</div>
                <input className='add-marker' style={styles.addNameContainer} onKeyPress={this._handleKeyPress}
                       ref={(input) => { this.textInput = input; }}
                />
                <div ref='warn' className='warn' style={{display: this.state.warn ? 'block' : 'none', ...styles.warnContainer}} >
                    Please select a location, enter a name, and click enter on the name.
                </div>
            </div>
        );
    }
}

const {
    number,
    string,
    object,
    bool,
    arrayOf
} = PropTypes;

MarkerItem.propTypes = {
    locationFeature: object.isRequired,
    regionId: string.isRequired
};

AddMarkerItem.propTypes = {
    locationFeature: object.isRequired,
    coordinates: arrayOf(number),
    regionId: string.isRequired
};

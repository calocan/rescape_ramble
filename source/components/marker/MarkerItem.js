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
import R from 'ramda';

export class MarkerItem extends React.Component {
    render() {
        return (
            <div className="marker-container">
                <icon click=""/>
                <div>{this.props.marker.name}</div>
            </div>
        );
    }
};

export class AddMarkerItem extends React.Component {
    render() {
        return (
            <div className="add-marker-container">
                <input className="add-marker"/>
                <icon click=""/>
                <div></div>
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

MarkerItem.propTypes = {
    name: string.isRequired,
    id: string.isRequired,
    color: string.isRequired
};

AddMarkerItem.propTypes = {

};



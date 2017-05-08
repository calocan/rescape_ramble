/**
 * Created by Andy Likuski on 2017.04.26
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {DraggablePointsOverlay, SVGOverlay} from 'react-map-gl';
import autobind from 'autobind-decorator';

const MapLines = (React) => React.createClass({

    @autobind
    _redrawSVGOverlay(opt) {
        if (!this.props.nodes.size) {
            return null;
        }
        const pointString = this.props.nodes.map(
            point => opt.project(point.get('location').toArray())
        ).join('L');

        return (
            <path
                style={ {stroke: '#1FBAD6', strokeWidth: 2, fill: 'none'} }
                d={ `M${pointString}` }/>
        );
    },

    render() {
        return <SVGOverlay
            className='map-lines'
            key="svg-overlay" { ...this.props.viewport }
            redraw={ this._redrawSVGOverlay } />
    }
});

const {
    number,
    string,
    object,
    bool,
    array
} = React.PropTypes;

MapLines.propTypes = {
    width: number.isRequired,
    height: number.isRequired,
    locations: array.isRequired,
};
export default MapLines;

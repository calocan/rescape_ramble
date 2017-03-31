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
import styles from './Region.style.js';
import R from 'ramda';
import React from 'react';

/***
 * The View for a Region, such as California. Theoretically we could display multiple regions at once
 * if we had more than one, or we could have a zoomed in region of California like the Bay Area.
 */
const Region = (React) => React.createClass({

    /*
     const {
     string, shape, func
     } = React.PropTypes;
     */
    updateDimensions: function() {

        const w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = styles.container.width * (w.innerWidth || documentElement.clientWidth || body.clientWidth),
            height = styles.container.height * (w.innerHeight|| documentElement.clientHeight|| body.clientHeight);

        this.setState({width, height});
    },
    componentWillMount: function() {
        this.updateDimensions();
    },
    componentDidMount: function() {
        window.addEventListener("resize", this.updateDimensions);
    },
    componentWillUnmount: function() {
        window.removeEventListener("resize", this.updateDimensions);
    },

    render: function() {
        return (
            <div className='region' style={R.merge(styles.container, this.state)}>
                {/* We additionally give Mapbox the container width and height so the map can track changes to these */}
                <Mapbox {...this.state}/>
            </div>
        );
    }
});

    /*
     Region.propTypes = {
     helloClass: string.isRequired,
     subject: string,
     actions: shape({
     setMode: func.isRequired
     })
     };
     */

export default Region;

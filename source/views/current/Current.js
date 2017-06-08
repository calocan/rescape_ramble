/**
 * Created by Andy Likuski on 2016.05.26
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Region from 'views/region/RegionContainer'
import styles from './Current.style.js';
import React from 'react'

/***
 * Displays the Region of the current state and eventually a Region selector.
 * This might also be modified to display all available regions, perhaps on a continental map
 */
class Current extends React.Component {

        /***
         * Updates the width and height property to match the window
         */
        updateDimensions() {
            const w = window,
                d = document,
                documentElement = d.documentElement,
                body = d.getElementsByTagName('body')[0],
                width = styles.container.width * (w.innerWidth || documentElement.clientWidth || body.clientWidth),
                height = styles.container.height * (w.innerHeight|| documentElement.clientHeight|| body.clientHeight);

            this.setState({width, height});
        }

        componentWillMount() {
            this.updateDimensions();
        }

        componentDidMount() {
            window.addEventListener("resize", this.updateDimensions);
        }

        componentWillUnmount() {
            window.removeEventListener("resize", this.updateDimensions);
        }

        render() {
            // Pass the absolute width and height to give to the Mapbox viewport
            return <div className='current'>
                <Region region={this.props.region} style={{width: this.state.width, height: this.state.height}}/>
            </div>
        }
};

const {
    string, object, number, func
} = React.PropTypes;
/***
 * Expect the current region
 * @type {{region: *}}
 */
Current.propTypes = {
    region: object.isRequired,
};
export default Current;

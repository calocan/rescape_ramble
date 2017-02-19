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
import MapBox from 'components/mapBox/MapBox'
import styles from './Region.style.js';

/***
 * The View for a Region, such as California. Theoretically we could display multiple regions at once
 * if we had more than one, or we could have a zoomed in region of California like the Bay Area.
 */
export default React => {

    /*
     const {
     string, shape, func
     } = React.PropTypes;
     */

    const region = ({}) => {
        // Convert percent to pixel.
        const size = {
            width: styles.container.width * document.documentElement.clientWidth,
            height: styles.container.height * document.documentElement.clientHeight
        }
        return (
            <div className='region' style={Object.assign(styles.container, size)} >
                {/* We additionally give Mapbox the container width and height so the map can track changes to these */}
                <MapBox {...size}/>
            </div>
        );
    }

    /*
     region.propTypes = {
     helloClass: string.isRequired,
     subject: string,
     actions: shape({
     setMode: func.isRequired
     })
     };
     */

    return region;
}

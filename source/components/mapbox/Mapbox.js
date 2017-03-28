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

import MapGL from 'react-map-gl';

export default React => {

    const {
        number,
        string
    } = React.PropTypes;

    const MapBox = ({onChangeViewport, ...props}) => {

        return (
            <MapGL
                {...props}
                showZoomControls={true}
                width={500}
                height={500}
                perspectiveEnabled={ true }
                // setting to `true` should cause the map to flicker because all sources
                // and layers need to be reloaded without diffing enabled.
                preventStyleDiffing={ false }
                onChangeViewport={onChangeViewport}
            />
        );
    }
    MapBox.propTypes = {
        width: number.isRequired,
        height: number.isRequired,
        mapboxApiAccessToken: string.isRequired
    };

    return MapBox;
};



/**
 * Created by Andy Likuski on 2017.04.26
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const React = require('react');
const {shallow} = require('enzyme');
const MapLines = require('./MapLines').default;

jest.mock('query-overpass');
const geojson = require('queryOverpassResponse').LA_SAMPLE;
const e = React.createElement;

describe('MapLines', () => {
    const props = {
        viewport: {
            bearing: 0,
            height: 500,
            isDragging: false,
            latitude: 37,
            longitude: -119,
            pitch: 40,
            startDragLngLat: null,
            width: 500,
            zoom: 5
        },
        geojson: geojson
    };
    it('MapLines can mount', () => {
        const wrapper = shallow(e(MapLines, props));
        expect(wrapper).toMatchSnapshot();
    });
    it('It redraws', () => {
        const wrapper = shallow(e(MapLines, props));
        const svgOverlayWrapper = wrapper.find('SVGOverlay');
        // svgOverlayWrapper.simulate('redraw');
        expect(svgOverlayWrapper.shallow()).toMatchSnapshot();
    });
});


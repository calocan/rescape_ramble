/**
 * Created by Andy Likuski on 2017.02.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {connect} = require('react-redux');
const MarkerList = require('./MarkerList').default;
const R = require('ramda');
const {actionCreators} = require('redux/geojson/geojsonReducer');

/**
 * Merges state.mapbox with ownProps, but raises level of state
 * @param {Object} state The Redux State
 * @param {Object} ownProps The props of the parent
 * @returns {Object} The props
 */
const mapStateToProps = module.exports.mapStateToProps = (state, ownProps) => {
    // include geojson data of the region
    return R.merge(
        R.pick(['geojson', 'id'], ownProps.region),
        {
            mapboxApiAccessToken: ownProps.region.mapbox.mapboxApiAccessToken
        }
    );
};

module.exports.default = connect(mapStateToProps, actionCreators)(MarkerList);

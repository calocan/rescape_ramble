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
const mapbox = require('components/mapbox/MapboxContainer').default;
const sankey = require('components/mapbox/SankeyContainer').default;
const markerList = require('components/marker/MarkerListContainer').default;
const styles = require('./Region.style').default;
const R = require('ramda');
const React = require('react');
const {reqPath, findOne, onlyOne} = require('rescape-ramda');
const PropTypes = require('prop-types');
const {makeMergeContainerStyleProps} = require('helpers/reselectHelpers');
const {eMap} = require('helpers/componentHelpers');
const [Mapbox, Sankey, MarkerList, Div] = eMap([mapbox, sankey, markerList, 'div']);

/**
 * The View for a Region, such as California. Theoretically we could display multiple regions at once
 * if we had more than one, or we could have a zoomed in region of California like the Bay Area.
 */
const Region = ({ ...props }) => {
  makeMergeDefaultStyleWithProps()

  const sx = R.merge(defaultStyles, {

  }

  return

class Region extends React.Component {
  componentWillReceiveProps(nextProps) {
    const getRegionId = R.compose(R.prop('id'), onlyOne, reqPath(['regions']));
    if (
      !(R.equals(...R.map(getRegionId, [this.props, nextProps]))) || // Region changed
      !reqPath(['region', 'geojson', 'osm', 'requested'], nextProps) // or geojson not yet requested
    ) {
      this.props.onRegionIsChanged(nextProps.settings.overpass, nextProps.region.geospatial.bounds);
    }
    if (
      !(R.equals(...R.map(getRegionId, [this.props, nextProps]))) || // Region changed
      !reqPath(['region', 'geojson', 'markers', 'requested'], nextProps) // or markers not yet requested
    ) {
      this.props.fetchMarkersData({}, nextProps.region.id);
    }
  }

  render() {
    // Applies parent container width/height to mapboxContainer width/height
    const multiplyByPercent = R.compose((percent, num) => num * parseFloat(percent) / 100.0);
    const styleMultiplier = prop => R.apply(
      // Multiply the fraction by the number, or
      multiplyByPercent,
      // Take the width or height of the stylesheet and the props style
      // The container value must be a fraction
      // this.props.style must be a number or undefined
      R.map(
        R.prop(prop),
        [styles.mapboxContainer, this.props.style]
      )
    );
    return Div({
        className: 'region',
        style: R.merge(this.props.style, styles.container)
      },
      /* We additionally give Mapbox the container width and height so the map can track changes to these
       We have to apply the width and height fractions of this container to them.
       */
      Div({
          className: 'mapboxContainer',
          style: styles.mapboxContainer
        },
        Sankey({
          style: {
            width: styleMultiplier('width'),
            height: styleMultiplier('height')
          }
        })
      ),
      Div({
          className: 'markersContainer',
          style: styles.markersContainer
        },
        MarkerList({})
      )
    );
  }
}

/**
 * Expect the region
 * @type {{region: *}}
 */
const {
  string, object, number, func, shape
} = PropTypes;

Region.propTypes = {
  settings: object.isRequired,
  region: shape({
    mapbox: shape({
      mapboxAccessToken: string.isRequired
    }).isRequired
  }).isRequired,
  style: object.isRequired,
  onRegionIsChanged: func.isRequired,
  fetchMarkersData: func.isRequired
};

module.exports.default = Region;

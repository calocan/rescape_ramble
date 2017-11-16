/**
 * Created by Andy Likuski on 2017.09.04
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {renderSankeySvgPoints} = require('helpers/sankeyHelpers');
const {makeMergeContainerStyleProps} = require('helpers/reselectHelpers');
const PropTypes = require('prop-types');
const React = require('react');
const createMapStops = require('components/mapStop/MapStops').default;
const {reqPath} = require('rescape-ramda').throwing;
const {geojsonByType} = require('helpers/geojsonHelpers');
const R = require('ramda');
const {sankey, sankeyLinkHorizontal} = require('d3-sankey');
const {mapDefault} = require('rescape-ramda');
const {deckGL, ScatterplotLayer, OrthographicViewport, COORDINATE_SYSTEM} = mapDefault('deckGl', require('deck.gl'));
const {eMap} = require('helpers/componentHelpers');
const sample = require('src/data/sankey.sample');
const [MapGL, DeckGL, Svg, G, Circle, Div] =
  eMap([require('react-map-gl'), deckGL, 'svg', 'g', 'circle', 'div']);
const d3 = require('d3');
const {resolveSvgPoints, resolveSvgReact} = require('helpers/svgHelpers');
const {classNamer, styleMultiplier} = require('helpers/styleHelpers');
const {makeMergeContainerStyleProps} = require('helpers/reselectHelpers');

const Sankey = ({...props}) => {

  const nameClass = classNamer('sankey');
  const styles = makeMergeContainerStyleProps()(
    {
      style: {
        root: reqPath(['style'], props),
      }
    },
    {
      root: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      }
    });
  const {viewport, mapboxApiAccessToken} = props;
  const {width, height} = props.style;
  const left = -Math.min(width, height) / 2;
  const top = -Math.min(width, height) / 2;
  const glViewport = new OrthographicViewport({width, height, left, top});

  const deck = width && height &&
    Div({
      className: nameClass('root'),
      style: styles.root
    }, [
      Svg({
          viewBox: `0 0 ${width} ${height}`
        },
        // TODO first argument needs to be opt from the SVGOverlay layer. See MapMarkers
        renderSankeySvgPoints(null, props, sample, node)
      )
    ]);

  return MapGL(R.merge(viewport, {
      mapboxApiAccessToken,
      showZoomControls: true,
      perspectiveEnabled: true,
      // setting to `true` should cause the map to flicker because all sources
      // and layers need to be reloaded without diffing enabled.
      preventStyleDiffing: false,
      onChangeViewport: this.props.onChangeViewport
    }),
    deck
  );
};

/*
  componentWillReceiveProps(nextProps) {
    const osmLens = R.lensPath(['region', 'geojson', 'osm', 'features', 'length']);
    const markersLens = R.lensPath(['region', 'geojson', 'markers']);
    // Features have changed
    if (R.view(osmLens, this.props) !== R.view(osmLens, nextProps)) {
      this.setState({osmByType: geojsonByType(nextProps.region.geojson.osm)});
    }
    if (R.view(markersLens, this.props) !== R.view(markersLens, nextProps)) {
      this.setState({markers: nextProps.region.geojson.markers});
    }
  }
*/

const {
  string,
  object,
  bool,
  func
} = PropTypes;

Sankey.propTypes = {
  style: object.isRequired,
  viewport: object.isRequired,
  mapboxApiAccessToken: string.isRequired,
  iconAtlas: string.isRequired,
  showCluster: bool.isRequired,
  region: object.isRequired,
  hoverMarker: func.isRequired,
  selectMarker: func.isRequired,
  onChangeViewport: func.isRequired,
  geojson: object.isRequired
};

module.exports.default = Sankey;

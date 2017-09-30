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

const PropTypes = require('prop-types');
const React = require('react');
const createMapStops = require('components/mapStop/mapStops').default;
const {reqPath} = require('rescape-ramda').throwing;
const {geojsonByType} = require('helpers/geojsonHelpers');
const R = require('ramda');
const {resolveSvgPoints, resolveSvgReact} = require('helpers/svgHelpers');
const styles = require('./Mapbox.style').default;
const {sankey, sankeyLinkHorizontal} = require('d3-sankey');
const {mapDefault} = require('rescape-ramda');
const {deckGL, ScatterplotLayer, OrthographicViewport, COORDINATE_SYSTEM} = mapDefault('deckGl', require('deck.gl'));
const {eMap} = require('helpers/componentHelpers');
const sample = require('data/sankey.sample');
const [MapGL, DeckGL, Svg, G, Circle, Div] =
  eMap([require('react-map-gl'), deckGL, 'svg', 'g', 'circle', 'div']);

const DEGREE_TO_RADIAN = Math.PI / 180;
const NUM_POINTS = 2000;


const round = x => Math.round(x * 10) / 10;

const nodePosition = module.exports.nodePositon = (node, point) => ({
  x: round(point.x),
  dx: round(node.x1 - node.x0),
  y: round(point.y),
  dy: round(node.y1 - node.y0)
});

const linkPosition = module.exports.linkPosition = link => ({
  source: nodePosition(link.source),
  target: nodePosition(link.target),
  dy: round(link.width),
  sy: round(link.y0 - link.source.y0 - link.width / 2),
  ty: round(link.y1 - link.target.y0 - link.width / 2)
});

class Sankey extends React.Component {

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

  _renderSVGPoints(opt) {
    const sankey = sankey().nodeWidth(15).nodePadding(10).extent([[1, 1], [this.props.style.width, this.props.style.height]]);
    // Map sample nodes to sample features
    const features = R.map(node =>
      ({
        type: 'Feature',
          properties: {
          '@id': 'node/27233097',
          'STIF:zone': '3',
          name: 'Asnières-sur-Seine',
          official_name: 'ASNIERES SUR SEINE',
          operator: 'SNCF',
          railway: 'station',
          'ref:SNCF': 'Transilien',
          'ref:SNCF:Transilien': 'J;L',
          source: 'survey',
          uic_ref: '8738113',
          wikipedia: 'fr:Gare d\'Asnières-sur-Seine',
          '@timestamp': '2016-05-27T08:20:46Z',
          '@version': '11',
          '@changeset': '39597830',
          '@user': 'overflorian',
          '@uid': '125897'
      },
        geometry: {
          type: 'Point',
            coordinates: [
            2.2834758,
            48.905901
          ]
        },
        id: 'node/27233097'
      }), sample.nodes);
    const points = resolveSvgPoints(opt, features)

    const graph = sankey(sample)
    graph.nodes.map((node, i) => nodePosition(node, points[i]));

    const svg = this.node;
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
      .selectAll("path")
      .data(graph.links)
      .enter().append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return d.width; });
    if (!this.props.geojson || !this.props.geojson.features) {
      return null;
    }
    return resolveSvgReact(opt, this.props.geojson.features);
  }

  render() {
    const { viewport, mapboxApiAccessToken} = this.props;

    const {width, height} = this.props.style;
    const left = -Math.min(width, height) / 2;
    const top = -Math.min(width, height) / 2;
    const glViewport = new OrthographicViewport({width, height, left, top});

    const deck =  width && height &&
      Div({}, [
        Svg({
            ref: node => this.node = node,
            viewBox: `0 0 ${width} ${height}`
          },
          this._renderSVGPoints()
        ),
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
  }
}

const {
  number,
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
};

module.exports.default = Sankey;

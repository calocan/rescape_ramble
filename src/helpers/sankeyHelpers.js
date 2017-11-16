/**
 * Created by Andy Likuski on 2017.11.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const {sankey} = require('d3-sankey');
const {resolveSvgPoints} = require('helpers/svgHelpers');
const {resolveSvgReact} = require('helpers/svgHelpers');

const DEGREE_TO_RADIAN = Math.PI / 180;
const NUM_POINTS = 2000;

const round = x => Math.round(x * 10) / 10;

const nodePosition = module.exports.nodePosition = (node, point) => ({
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

/**
 * This needs to be debugged
 * @param opt
 * @param props
 * @param sankeyData
 * @param elem
 * @returns {null}
 */
module.exports.renderSankeySvgPoints = (opt, props, sankeyData, elem) => {
  const theSankey = sankey().nodeWidth(15).nodePadding(10).extent([[1, 1], [props.style.width, props.style.height]]);
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
    }), sankeyData.nodes);
  const points = resolveSvgPoints(opt, features);

  const graph = theSankey(sankeyData);
  graph.nodes.map((node, i) => nodePosition(node, points[i]));

  elem.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-opacity', 0.2)
    .selectAll('path')
    .data(graph.links)
    .enter().append('path')
    .attr('d', d3.sankeyLinkHorizontal())
    .attr('stroke-width', function (d) {
      return d.width;
    });
  if (!props.geojson || !props.geojson.features) {
    return null;
  }
  return resolveSvgReact(opt, props.geojson.features);
};

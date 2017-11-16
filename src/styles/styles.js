/**
 * Created by Andy Likuski on 2017.11.08
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// const chroma = require('chroma-js');
const R = require('ramda');
const {createScaledPropertyGetter} = require('helpers/styleHelpers');

const white = '#fff';
const black = '#111';
const blue = '#07c';

module.exports.colors = {
  white,
  black,
  blue
};

module.exports.space = [
  0,
  8,
  16,
  32,
  64
];

const alpha = (color) => (a) => 0; // chroma(color).alpha(a).css();
const darken = alpha('#000');

module.exports.shade = [
  darken(0),
  darken(1 / 8),
  darken(1 / 4),
  darken(1 / 2)
];

// Modular powers of two scale
const scale = [
  0,
  8,
  16,
  32,
  64
];

const getScaledProperty = createScaledPropertyGetter(scale);
module.exports.getMargin = getScaledProperty('margin');
module.exports.getPadding = getScaledProperty('padding');

/**
 * The default styles for all components
 * @type {*}
 */
module.exports.defaultStyles = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  margin: 0,
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 16,
  paddingRight: 16,
  border: 0,
  color: 'white',
  backgroundColor: 'blue',
  WebkitAppearance: 'none',
  MozAppearance: 'none'
};

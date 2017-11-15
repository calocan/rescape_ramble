/**
 * Created by Andy Likuski on 2017.11.13
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const R = require('ramda');
const PropTypes = require('prop-types');
const {v} = require('rescape-validate');
const {compact} = require('rescape-ramda');

/**
 * Creates a class name from a root name and a suffix
 * @param {String} root The root of the name matching the React component
 * @param {String} suffix The suffix matching the minor component (such as 'outer', 'inner' for divs).
 * If null then the className will simply be the root
 * @returns {String} root-suffix or root if suffix is not specified
 */
module.exports.classNamer = R.curry((root, suffix) => R.join('-', compact([root, suffix])));

/** *
 * Creates a function that multiplies a numeric value of a style by a fraction
 * This is used to map a container style numeric value to a proportional numeric value in the child component
 * when the child component's style must be specified as an absolute value rather than a fraction of the parent
 *
 * @param {Number} containerStyleValue The container style numeric value
 * @param {Object} styleValue The local style decimal value
 * @sig Number -> Number -> Object
 * @return {Function} A function that accepts two objects. The first object must have a
 * fraction value for the given prop. The second object must have a numeric value
 */
module.exports.styleMultiplier = v(R.curry((containerStyleValue, styleValue) =>
  containerStyleValue * styleValue
), [
  ['containerStyleValue', PropTypes.number.isRequired],
  ['styleValue', PropTypes.number.isRequired]
], 'styleMultiplier');

/**
 * Scaled value function creator
 * @param {[Number]} scale Array of scale values, such that array index values 0..n can be passed for
 * x and return a corresponding scale value
 * @param {String} prop The style prop, such as 'margin' or 'padding'
 * @param {Number} index The index of scale to access
 * @returns {Object} A single keyed object keyed by prop and valued by scale[x].
 * If index or scale[index] is not a Number an Error is thrown, as this is always a coding error
 */
module.exports.createScaledPropertyGetter = R.curry((scale, prop, index) => {
  const getScale = R.prop(R.__, scale);
  return R.ifElse(
    R.both(
      R.is(Number),
      i => R.is(Number, getScale(i))
    ),
    i => ({[prop]: getScale(i)}),
    i => {
      throw new Error(`x or scale[x] is not a number: x: ${i}, scale: ${scale}`);
    }
  )(index);
});

module.exports.applyStyles = R.curry((styles, component) => {

});

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

const React = require('react');
const R = require('ramda');
const {v} = require('rescape-validate');
const PropTypes = require('prop-types');
const {filterWithKeys, throwing: {reqPath}} = require('rescape-ramda');

/**
 * Returns true if the lens applied to props equals the lens applied to nextProps
 * @param {Function} lens Ramda lens
 * @param {Object|Array} props React props
 * @param {Object|Array} nextProps Reach nextProps
 * @returns {Boolean} True if equal, else false
 */
module.exports.propLensEqual = v(R.curry((lens, props, nextProps) =>
    R.equals(
      R.view(lens, props),
      R.view(lens, nextProps)
    )
  ),
  [
    ['lens', PropTypes.func.isRequired],
    ['props', PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired],
    ['nextProps', PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired]
  ], 'propLensEqual');

/**
 * Maps each Reach element to an curried e function.
 * @param {[String|Element]} types React element types (e.g. ['div', 'svg', React])
 * @returns {Function} A list of functions that need just the config and children specified, not the type
 */
module.exports.eMap = types => R.map(component => React.createFactory(component), types);


/**
 * Copies any needed actions to view containers
 * Also removes ownProps from the return value since we already incorporated theses into stateProps
 * @props {Object} viewToActions An object keyed by view that is in stateProps.views and valued by
 * an array of action names
 * @returns {Function} A mergeProps function that expects stateProps and dispatchProps (The standard
 * third argument ownProps is never used, since it is assumed to have been merged into stateProps)
 */
module.exports.mergePropsForViews = (viewToActions) => (stateProps, dispatchProps) => {
  return R.over(
    R.lensProp('views'),
    R.mergeWith(
      (actions, view) => {
        // Merge each view configuration with the actions it needs according to viewToActions
        return R.merge(
          view,
          filterWithKeys((_, prop) => R.contains(prop, actions), dispatchProps)
        );
      },
      viewToActions),
    R.merge(stateProps, dispatchProps)
  );
};

/**
 * Given a container's mapStateToProps and mapDispatchToProps, returns a function that accepts a sample state
 * and sample ownProps. This function may be exported by a container to help with unit tests
 * @param {Function} mapStateToProps The mapStatesToProps function of a container. It will be passed
 * sampleState and sampleOwnProps when invoked
 * @param {Function} mapDispatchToProps The mapDispatchToProps function of a container. It will be passed
 * the identity function for a fake dispatch and sampleOwnProps when invoked
 * @param {Function} [mergeProps] Optional mergeProps function. Defaults to R.merge to merge the result
 * of mapStateToProps and mapDispatchToProps results
 * @returns {Function} A function that expects a sample state and sample ownProps and returns a complete
 * sample props according to the functions of the container
 */
module.exports.makeTestPropsFunction = (mapStateToProps, mapDispatchToProps, mergeProps = R.merge) =>
  (sampleState, sampleOwnProps) =>
    mergeProps(
      mapStateToProps(sampleState, sampleOwnProps),
      mapDispatchToProps(R.identity), sampleOwnProps
    );

/**
 * Given a React component function that expects props and given props that are a functor (Array or Object),
 * lift the component to handle all values of the functor and then extract the values
 * @param {Function} component A React component function that expects props
 * @param {Functor} props An array or object (or any other functor for which we can extract the values
 * Each value contains the props to create on component using the component function. The results are
 * returned as an array of components
 * @return {[Object]} A list of React components
 */
const liftAndExtract = module.exports.liftAndExtract = (component, props) => {
  return R.values(
    // Note that R.map(component, props) would work here too,
    // but this might refactor better if we support passing child components
    R.liftN(1, component)(props)
  )
};

/**
 * Like liftAndExtract but expects propsWithItems to have an items key holding the functor
 * This is useful to separate dispatch actions from the props functor, since dispatch
 * actions are always the same for all items
 * @param {Function} component A React component function that expects props
 * @param {Object} propsWithItems Has a key items that holds an array or object
 * (or any other functor for which we can extract the values
 * @return {[Object]} A list of React components
 */
module.exports.liftAndExtractItems = (component, propsWithItems) => {
  return liftAndExtract(component, reqPath(['items'], propsWithItems))
};
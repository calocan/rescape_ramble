/**
 * Created by Andy Likuski on 2017.10.17
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const R = require('ramda');
const {propLensEqual, mergePropsForViews, makeTestPropsFunction, liftAndExtract} = require('./componentHelpers');

describe('componentHelpers', () => {
  test('propLensEqual', () => {
    const foul = {ball: 'left field'};
    const fair = {ball: 'left field'};
    const strike = {ball: 'catcher'};
    const lens = R.lensPath(['yuk', 'dum', 'boo', 'bum']);
    expect(propLensEqual(
      lens,
      {yuk: {dum: {boo: {bum: foul}}}},
      {yuk: {dum: {boo: {bum: fair}}}}
    )).toEqual(true);
    expect(propLensEqual(
      lens,
      {yuk: {dum: {boo: {bum: foul}}}},
      {yuk: {dum: {boo: {bum: strike}}}}
    )).toEqual(false);
  });

  test('mergePropsForViews', () => {
    const mergeProps = mergePropsForViews({aView: ['action1', 'action2'], bView: ['action2', 'action3']});
    const stateProps = {a: 1, views: {aView: {stuff: 1}, bView: {moreStuff: 2}}};
    const dispatchProps = {
      action1: R.identity,
      action2: R.identity,
      action3: R.identity
    };
    // mergeProps should merge stateProps and dispatchProps but copy the actions to stateProps.views according
    // to the mapping given to mergePropsForViews
    expect(mergeProps(stateProps, dispatchProps)).toEqual(
      R.merge({
        a: 1,
        views: {
          aView: {stuff: 1, action1: R.identity, action2: R.identity},
          bView: {moreStuff: 2, action2: R.identity, action3: R.identity}
        }
      }, dispatchProps)
    );
  });

  test('makeTestPropsFunction', () => {
    const mergeProps = mergePropsForViews({aView: ['action1', 'action2'], bView: ['action2', 'action3']});
    const sampleState = ({a: 1, views: {aView: {stuff: 1}, bView: {moreStuff: 2}}});
    const sampleOwnProps = {style: {width: 100}};
    const mapStateToProps = (state, ownProps) => R.merge(state, ownProps);
    const dispatchResults = {
      action1: R.identity,
      action2: R.identity,
      action3: R.identity
    };
    const mapDispatchToProps = (dispatch, ownProps) => dispatchResults;
    // given mapStateToProps, mapDispatchToProps, and mergeProps we get a function back
    // that then takes sample state and ownProps. The result is a merged object based on container methods
    // and sample data
    expect(makeTestPropsFunction(mapStateToProps, mapDispatchToProps, mergeProps)(sampleState, sampleOwnProps))
      .toEqual(
        R.merge({
          a: 1,
          style: {width: 100},
          views: {
            aView: {stuff: 1, action1: R.identity, action2: R.identity},
            bView: {moreStuff: 2, action2: R.identity, action3: R.identity}
          }
        }, dispatchResults)
      );
  });

  test('liftAndExtract', () => {
    // Pretend R.identity is a component function
    expect(
      liftAndExtract(R.identity, {a: {my: 'props'}, b: {your: 'props'}})
    ).toEqual(
      [{my: 'props'}, {your: 'props'}]
    )
  })
});

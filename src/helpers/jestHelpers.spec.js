/**
 * Created by Andy Likuski on 2017.06.19
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {expectTask, testState, makeSampleInitialState, propsFromSampleStateAndContainer, makeTestScopedActions} = require('./jestHelpers');
const Task = require('data.task');
const R = require('ramda');

describe('jestHelpers', () => {
  test('expectTask', () => {
    expectTask(new Task((reject, resolve) => resolve('apple'))).resolves.toEqual('apple');
    expectTask(new Task((reject, resolve) => {
      throw new Error('snapple');
    })).rejects.toEqual(new Error('snapple'));
  });

  test('testState', () =>
    expect(testState()).toMatchSnapshot()
  );

  test('propsFromSampleStateAndContainer', () => {
    const initialState = makeSampleInitialState();

    // propsFromSampleStateAndContainer should take a function that merges processes
    // state and ownProps based on a container's
    // mapStateToProps, mapDispatchToProps, and mergeProps.
    // This function alweays uses makeSampleInitialState as the state and accepts
    // sample ownProps from the test
    expect(propsFromSampleStateAndContainer(
      // Simply merge a fake dispatch result with the sampleOwnProps
      (sampleInitialState, sampleOwnProps) => R.mergeAll([sampleInitialState, {someAction: R.identity}, sampleOwnProps]),
      // our sample ownProps
      {sample: 'own props'}))
      .toEqual(
        R.mergeAll([
          {someAction: R.identity},
          initialState,
          {sample: 'own props'}
        ])
      );
  });

  test('makeTestScopedActions', () => {
    const actions = makeTestScopedActions(scope => ({
        aAction: () => scope
      }),
      ['apple', 'orange']
    );
    expect(R.keys(actions.aAction())).toEqual(['apple', 'orange']);
  });
});


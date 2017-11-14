/**
 * Created by Andy Likuski on 2017.06.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const {taskToPromise} = require('rescape-ramda');
const configureStore = require('redux-mock-store').default;
const {sampleConfig} = require('data/samples/sampleConfig');
const initialState = require('data/initialState').default;
const thunk = require('redux-thunk').default;
const middlewares = [thunk];
const R = require('ramda');

/**
 * Given a task, wraps it in promise and passes it to Jest's expect.
 * With this you can call resolves or rejects depending on whether success or failure is expected:
 * expectTask(task).resolves|rejects
 * @param {Task} task Task wrapped in a Promise and forked
 * @returns {undefined}
 */
module.exports.expectTask = task => expect(taskToPromise(task));
/**
 * Same as expectTask but expects a rejects so diables debugging
 * @param {Task} task The Task
 * @returns {undefined}
 */
module.exports.expectTaskRejected = task => expect(taskToPromise(task, true));

/**
 * Create an initial test state based on the sampleConfig for tests to use.
 * This should only be used for sample configuration, unless store functionality is being tested
 * @returns {Object} The initial state
 */
module.exports.testState = () => initialState(sampleConfig);
/**
 * Like test state but initializes a mock store. This will probably be unneeded
 * unless the middleware is needed, such as cycle.js
 * @param {Object} sampleUserSettings Merges in sample local settings, like those from a browser cache
 */
const makeSampleInitialState = module.exports.makeSampleInitialState = (sampleUserSettings = {}) => {
  const mockStore = configureStore(middlewares);

  /**
   * Creates a mock store that merges the initial state with local user settings.
   */
  const store = mockStore(R.merge(
    initialState(sampleConfig),
    sampleUserSettings
  ));
  return store.getState();
};

/**
 * Simulates complete props from a container component by combining mapStateToProps, mapDispatchToProps, and props
 * that would normally passed from the container to a component
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @param parentProps
 */
module.exports.propsFromSampleStateAndContainer = (mapStateToProps, mapDispatchToProps = {}, parentProps = {}) =>
  R.compose(
    state => R.mergeAll(
      [
        mapStateToProps(state),
        mapDispatchToProps(state),
        parentProps
      ]
    )
  )(makeSampleInitialState());

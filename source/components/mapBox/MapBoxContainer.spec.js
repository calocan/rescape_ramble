/**
 * Created by Andy Likuski on 2017.02.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import test from 'tape-catch';
import MapBoxContainer from './MapBoxContainer';
import MapBox from './MapBox';
import configureStore from 'redux-mock-store';
const middlewares = [thunk, logger];
const mockStore = configureStore(middlewares);
const action = { type: 'ADD_TODO' };


test('MapBoxContainer can mount', t => {
    const initialState = {}; // initial state of the store

    const store = mockStore(initialState)
    store.dispatch(action)

    const wrapper = mount(
        <Provider store={store}>
            <MapBoxContainer />
        </Provider>
    );

    const FoundMapBoxContainer = wrapper.find(MapBoxContainer);
    const FoundMapBoxComponent = FoundMapBoxContainer.find(MapBox);

    t.ok(FoundMapBoxContainer.length)
    t.ok(FoundMapBoxComponent.length)
});

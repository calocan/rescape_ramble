/**
 * Created by Andy Likuski on 2017.02.07
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import enhanceMapReducer, {createViewportReducer} from 'redux-map-gl';
import R from 'ramda';
import {SET_STATE} from './fullState'
import {Map} from 'immutable'
import {copy} from 'helpers/functions'

const SET_MODE = '/settings/SET_MODE';
const SET_SUBJECT = '/settings/SET_SUBJECT';

const viewportReducer = createViewportReducer();
const regionsReducer = (
    state = { }, action = {}
) => {

    switch (action.type) {
        case SET_STATE:
            return R.merge(state, action.state['regions'] || {});
        case 'map/CHANGE_VIEWPORT':
            // Delegate CHANGE_VIEWPORT to the viewportReducer for the current Region's mapbox state
            // Let the reducer reduce and set state.current.mapbox
            // I need to deep copy state for a deep path R.set to prevent mutation of state
            const lens = R.lensPath([state.currentKey, 'mapbox']);
            return R.set(
                lens,
                viewportReducer(R.view(lens, state), action),
                copy(state)
            );
        default:
            return state;
    }
};

export default regionsReducer;

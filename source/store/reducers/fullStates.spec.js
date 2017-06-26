/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {SET_STATE, FETCH_FULL_STATE_REQUEST, FETCH_FULL_STATE_SUCCESS, setState, fetchFullState} from './fullStates'
import nock from 'nock'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('full state actionTypes', () => {

    it('SET_STATE sets the full state', () => {
        const state = {
            settings: {
                foo: 1
            },
            map: {
                bar: 1
            },
        };
        expect(setState(state)).toEqual({
            type: SET_STATE,
            state
        });
    });

    it('creates FETCH_FULL_STATE_SUCCESS when fetching full state has been done', () => {

        const fakeHost = 'http://cloudycloud.co'
        // Mock fetch to always return the same thing
        nock(fakeHost)
            .get('/settings')
            .reply(200, {
                body: {
                    settings: {
                        foo: 1
                    }
                }
            });

        const expectedActions = [
            { type: FETCH_FULL_STATE_REQUEST },
            {
                type: FETCH_FULL_STATE_SUCCESS,
                body: {
                    settings: {
                        foo: 1
                    }
                }
            }
        ];
        const store = mockStore({ settings: {} })

        // TODO redo
        /*
        store.dispatch(fetchFullState(fakeHost))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            });
        */
        nock.cleanAll()
    })
});

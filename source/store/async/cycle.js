/**
 * Created by Andy Likuski on 2017.06.23
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import * as actions from '../actionTypes';
import * as ActionTypes from '../ActionTypes';

import { combineCycles } from 'redux-cycles';
import xs from 'xstream';

export function fetchReposByUser(sources) {
    const user$ = sources.ACTION
        .filter(action => action.type === ActionTypes.REQUESTED_USER_REPOS)
        .map(action => action.payload.user);

    const request$ = user$
        .map(user => ({
            url: `https://api.github.com/users/${user}/repos`,
            category: 'users'
        }));

    const response$ = sources.HTTP
        .select('users')
        .flatten();

    const action$ = xs.combine(response$, user$)
        .map(arr => actions.receiveUserRepos(arr[1], arr[0].body));

    return {
        ACTION: action$,
        HTTP: request$
    }
}

export function searchUsers(sources) {
    const searchQuery$ = sources.ACTION
        .filter(action => action.type === ActionTypes.SEARCHED_USERS)
        .map(action => action.payload.query)
        .filter(q => !!q)
        .map(q =>
            sources.Time.periodic(800)
                .take(1)
                .mapTo(q)
                .endWhen(
                    sources.ACTION.filter(action =>
                    action.type === ActionTypes.CLEARED_SEARCH_RESULTS)
                )
        )
        .flatten()

    const searchQueryRequest$ = searchQuery$
        .map(q => ({
            url: `https://api.github.com/search/users?q=${q}`,
            category: 'query'
        }))

    const searchQueryResponse$ = sources.HTTP
        .select('query')
        .flatten()
        .map(res => res.body.items)
        .map(actions.receiveUsers)

    return {
        ACTION: searchQueryResponse$,
        HTTP: searchQueryRequest$
    }
}

function clearSearchResults(sources) {
    const clear$ = sources.ACTION
        .filter(action => action.type === ActionTypes.SEARCHED_USERS)
        .filter(action => !!!action.payload.query)
        .map(actions.clearSearchResults);

    return {
        ACTION: clear$
    }
}

export default combineCycles(fetchReposByUser, searchUsers, clearSearchResults);


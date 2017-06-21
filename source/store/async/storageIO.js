/**
 * Created by Andy Likuski on 2017.06.21
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import R from 'ramda'
import Task from 'data.task'

/****
 * Curryable function returning a Task to seek data from a PouchDb with a given id.
 * If the fetch does not match a result the fetchTask is called
 * and the resultant data is inserted into the db with the given id
 * @param {Task} fetchTask Task to fork if db doesn't have the given id
 * @param {PouchDb} db The PouchDb to fetch from
 * @param {String} id The id to fetch
 */
export const retrieveOrFetch = R.curry((fetchTask, db, id) => {
    return new Task((reject, response) => {
        db.get(id).then(doc => response(doc)).catch(error => {
            // Make sure error is not found before sending empty response
            if (error.status === 404) {
                return response()
            }
            else {
                reject(error)
            }
        })
    }).chain(response => {
        // If no response chain fetchTask, otherwise just return the doc
        return R.ifElse(
                R.isNil,
                () => fetchTask,
                doc => Task.of(doc)
            )(response)
        }
    )
});
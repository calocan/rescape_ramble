/**
 * Created by Andy Likuski on 2017.03.13
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import moment from 'moment'

/***
 * Converts the time string in the format HH:MM:[SS] into a Date
 * @param {string} timeString
 * @param {Number} [dwellTime] Optional dwellTime to add to the timeString for departure times
 * @returns {Date}
 */
export const parseTimeToGenericDate = (timeString, dwellTime=0) => {
    const timeSegments = timeString.split(':').map(t => parseInt(t));
    return moment.utc(2000, 0, 1, ...timeSegments.slice(2)).add((timeSegments[3] || 0) + dwellTime, 's');
};

export const toTimeString = (departureDate, arrivalDate) => {
    const date = new Date(2000, 1, 1);
    return [
        (departureDate.getDate() - arrivalDate.getDate()) * 24 + date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ].join(':');
};
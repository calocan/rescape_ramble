/**
 * Created by Andy Likuski on 2017.03.03
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Make Enzyme Rx available in all test files without importing
const { shallow, render, mount } = require('enzyme');
// Enzyme setup
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
enzyme.configure({ adapter: new Adapter() });

const fs = require('fs');
const {JSDOM} = require('jsdom');
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.navigator = {};
//global.navigator.userAgent = 'Test';
// Some components like react-scrollview need document defined
global.document = new JSDOM();
global.window = global
Error.stackTraceLimit = Infinity;
// Have exceptions traces traverse async processes
if (process.env.NODE_ENV !== 'production'){
    require('longjohn');
}

// Make the __database__ dir to store local databases
// Local databases are only need in Node since they are normally stored in the browser
const PATH = global.NODE_POUCH_DB_PATH = `${__dirname}/src/data/__databases__/`;
if (!fs.existsSync(PATH))
    fs.mkdirSync(PATH);

// Fail tests on any warning
/*
console.error = message => {
    throw new Error(message);
};
 */
// https://github.com/facebook/jest/issues/3251
process.on('unhandledRejection', (reason) => {
    console.log('Unhandled Promise', reason)
})

import React from 'react';
import reactDom from 'react-dom/server';
import test from 'tape-catch';
import dom from 'cheerio';

import createCurrent from './Current';

const Current = createCurrent(React);
const render = reactDom.renderToStaticMarkup;

test('Current', t => {
  const titleText = 'Hello!';
  const props = {
    title: titleText,
    titleClass: 'title'
  };
  const re = new RegExp(titleText, 'g');

  const el = <Current { ...props } />;
  const $ = dom.load(render(el));
  const output = $('.title').html();
  const actual = re.test(output);
  const expected = true;

  t.equal(actual, expected,
    'should output the correct title text');

  t.end();
});

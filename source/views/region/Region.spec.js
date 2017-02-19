import React from 'react';
import reactDom from 'react-dom/server';
import test from 'tape-catch';
import dom from 'cheerio';

import createRegion from './Region';

const Region = createRegion(React);
const render = reactDom.renderToStaticMarkup;

test('Region', t => {
  const titleText = 'Hello!';
  const props = {
    title: titleText,
    titleClass: 'title'
  };
  const re = new RegExp(titleText, 'g');

  const el = <Region { ...props } />;
  const $ = dom.load(render(el));
  const output = $('.title').html();
  const actual = re.test(output);
  const expected = true;

  t.equal(actual, expected,
    'should output the correct title text');

  t.end();
});

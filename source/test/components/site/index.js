import React from 'react';
import reactDom from 'react-dom/server';
import test from 'tape-catch';
import dom from 'cheerio';

import createSite from 'components/site';

const Site = createSite(React);
const render = reactDom.renderToStaticMarkup;

test('Site', assert => {
  const titleText = 'Hello!';
  const props = {
    title: titleText,
    titleClass: 'title'
  };
  const re = new RegExp(titleText, 'g');

  const el = <Site { ...props } />;
  const $ = dom.load(render(el));
  const output = $('.title').html();
  const actual = re.test(output);
  const expected = true;

  assert.equal(actual, expected,
    'should output the correct title text');

  assert.end();
});

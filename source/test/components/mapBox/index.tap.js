import React from 'react';
import reactDom from 'react-dom/server';
import test from 'tape';
import dom from 'cheerio';

import slippyMap from 'components/slippyMap/index';
import createActions from 'test-fixtures/components/hello/create-actions';

const SlippyMap = slippyMap(React);
const render = reactDom.renderToStaticMarkup;

test('MapBox', nest => {
  nest.test('...with no parameters', assert => {
    const msg = 'should render our hello greeting!';

    const text = '<p>Hello, World!</p>';
    const re = new RegExp(text, 'g');

    const props = {
      actions: createActions()
    };

    const el = <SlippyMap { ...props } />;
    const $ = dom.load(render(el));
    const output = $.html();

    const actual = re.test(output);
    const expected = true;

    assert.equal(actual, expected, msg);

    assert.end();
  });

  nest.test('...with a subject', assert => {
    const msg = 'should render greeting with correct subject!';

    const text = '<p>Hello, React!</p>';
    const re = new RegExp(text, 'g');

    const props = {
      subject: 'React',
      actions: createActions()
    };

    const el = <Hello { ...props } />;
    const $ = dom.load(render(el));
    const output = $.html();

    const actual = re.test(output);
    const expected = true;

    assert.equal(actual, expected, msg);

    assert.end();
  });
});

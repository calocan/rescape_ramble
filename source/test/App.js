import React from 'react';
import reactDom from 'react-dom/server';
import test from 'tape';
import dom from 'cheerio';

import createApp from 'components/App.js';
import createActions from 'test-fixtures/components/map/create-actions';

const render = reactDom.renderToStaticMarkup;
const App = createApp(React);

test('Map', t => {
  const msg = 'Should render all sections.';

  const props = {
    foo: 'foo',
    siteClass: 'site',
    mapClass: 'map',
    title: 'Yay!',
    actions: createActions()
  };

  const el = <App{ ...props } />;
  const $ = dom.load(render(el));

  const actual = {
    Site: Boolean($(`.${ props.siteClass }`).html()),
    Map: Boolean($(`.${ props.mapClass }`).html())
  };

  const expected = {
    Site: true,
    Map: true
  };

  t.deepEqual(actual, expected, msg);

  t.end();
});

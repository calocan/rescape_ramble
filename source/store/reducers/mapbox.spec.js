import test from 'tape-catch';
import deepFreeze from 'deep-freeze';

import settings from 'store/reducers/settings';

test('mapbox', () => {})
test('SET_MODE', nest => {
  nest.test('...initial', assert => {
    const message = `should set { mode: 'display', subject: 'world' }`;

    const expected = {
      mode: 'display',
      subject: 'World'
    };

    const actual = settings

    assert.deepEqual(actual, expected, message);
    assert.end();
  });


  nest.test(`...with { mode: 'edit' }`, assert => {
    const message = 'should set mode to edit mode';

    const stateBefore = {
      mode: 'display',
      subject: 'World'
    };
    const action = {
      type: 'SET_MODE',
      mode: 'edit'
    };
    const expected = {
      mode: 'edit',
      subject: 'World'
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    const actual = settings(stateBefore, action);

    assert.deepEqual(actual, expected, message);
    assert.end();
  });

  nest.test(`...with { subject: 'foo'}`, assert => {
    const message = 'should set subject to "foo"';

    const stateBefore = {
      mode: 'display',
      subject: 'World'
    };
    const action = {
      type: 'SET_SUBJECT',
      subject: 'foo'
    };
    const expected = {
      mode: 'display',
      subject: 'foo'
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    const actual = settings(stateBefore, action);

    assert.deepEqual(actual, expected, message);
    assert.end();
  });
});

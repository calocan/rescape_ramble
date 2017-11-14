
const {styleMultiplier, createScaledPropertyGetter} = require('./styleHelpers');

describe('styles', () => {
  test('styleMultiplier', () => {
    expect(styleMultiplier('width', {width: 100}, {width: 0.25})).toEqual(25);
  });

  test('createScaledPropertyGetter', () => {
    expect(createScaledPropertyGetter([2, 4, 8], 'margin', 2)).toEqual({margin: 8});
    expect(() => createScaledPropertyGetter([2, 4, 8], 'margin', 'mayo')).toThrow();
    expect(() => createScaledPropertyGetter([2, 'tuna fish', 8], 'margin', 1)).toThrow();
  });
});

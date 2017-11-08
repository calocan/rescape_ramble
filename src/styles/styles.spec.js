
const {createScaledPropertyGetter} = require('./styles');

describe('styles', () => {
  test('createScaledPropertyGetter', () => {
    expect(createScaledPropertyGetter([2, 4, 8], 'margin', 2)).toEqual({margin: 8});
    expect(() => createScaledPropertyGetter([2, 4, 8], 'margin', 'mayo')).toThrow()
    expect(() => createScaledPropertyGetter([2, 'tuna fish', 8], 'margin', 1)).toThrow()
  })
});
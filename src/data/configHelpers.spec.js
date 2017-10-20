/**
 * Created by Andy Likuski on 2017.09.29
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Copies the 'default' region to the specified region keys.
 * This basically clones a template so that it can be merged into each real region
 * @param {Object} defaultConfig The defaultConfig being merged into another config
 * The default region of this config is copied to the given regionKeys
 * @param {[String]} regionKeys The region keys to target.
 * @returns {Object} The "modified" defaultConfig
 */
const {applyDefaultRegion, mapDefaultUsers, keysAsIdObj, applyRegionsToUsers} = require('./configHelpers');
const {defaultConfig, userTemplateKeys: {REGION_MANAGER, REGION_USER}} = require('data/default');
const R = require('ramda');
const {reqPath} = require('rescape-ramda').throwing;

describe('configHelpers', () => {
  test('applyDefaultRegion', () => {
    const regions = {
      kamchatka: {
        id: 'kamchatka',
        name: 'Kamchatka',
        wildcats: {
          servals: 2
        }
      },
      saskatoon: {
        id: 'saskatoon',
        name: 'Saskatoon',
        crops: ['berries']
      }
    };
    expect(
      R.keys(applyDefaultRegion(regions).kamchatka).sort()
    ).toEqual(
      R.keys(
        R.merge(
          regions.kamchatka,
          reqPath(['regions', 'default'], defaultConfig)
        )
      ).sort()
    );
  });

  test('mapDefaultUsers', () => {
    const realUsers = {
      linus: {
        permissions: {
          b: 'Security Blanket'
        }
      },
      lucy: {
        permissions: {
          b: 'Psychiatrist'
        }
      },
      pigpen: {
        permissions: {
          b: 'Stink'
        }
      }
    };

    const mergedConfig = mapDefaultUsers({
      [REGION_MANAGER]: R.pick(['linus', 'lucy'], realUsers),
      [REGION_USER]: R.pick(['pigpen'], realUsers)
    });

    expect(
      R.keys(reqPath([REGION_MANAGER, 'linus'], mergedConfig)).sort()
    ).toEqual(
      R.keys(
        R.merge(
          realUsers.linus,
          reqPath(['users', REGION_MANAGER], defaultConfig)
        )
      ).sort()
    );
  });

  test('keyAsIdObj', () => {
    expect(
      keysAsIdObj('smoothie', 'song')
    ).toEqual(
      {
        smoothie: {id: 'smoothie'},
        song: {id: 'song'}
      }
    );
  });

  test('applyRegionsToUsers', () => {
    const regions = {
      a: {id: 'a', name: 'A'},
      b: {id: 'b', name: 'B'}
    };
    const users = {
      y: {id: 'y', name: 'Y'},
      z: {id: 'z', name: 'Z'}
    };
    expect(applyRegionsToUsers(regions, users)).toEqual(
      {
        y: {id: 'y', name: 'Y', regions: [{id: 'a', isSelected: true}, {id: 'b'}]},
        z: {id: 'z', name: 'Z', regions: [{id: 'a', isSelected: true}, {id: 'b'}]}
      }
    );
  });
});

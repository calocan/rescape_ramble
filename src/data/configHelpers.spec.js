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
const {mapDefaultRegion, mapDefaultUsers} = require('./configHelpers');
const R = require('ramda');
const {mergeDeep} = require('rescape-ramda');

describe('configHelpers', () => {
  test('mapDefaultRegion', () => {
    const defaultConfig = {
      regions: {
        default: {
          name: 'Jon Doe',
          wildcats: {
            caracals: 5,
          }
        }
      },
      dinosaurs: {
        albertosaurus: {
          id: 'albertosaurus',
          dental: {
            sharp: 'yes'
          }
        }
      }
    };
    const realConfig = {
      regions: {
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
      },
      dinosaurs: {
        allosaurus: {
          id: 'allosaurus',
          dental: {
            canines: 'yes'
          }
        }
      }
    };
    expect(mergeDeep(
      mapDefaultRegion(['kamchatka', 'saskatoon'], defaultConfig),
      realConfig
    )).toEqual(
      {
        // Should merge default with each region
        regions: R.merge(
          defaultConfig.regions,
          R.map(mergeDeep(defaultConfig.regions.default), realConfig.regions)
        ),
        // Normal merge
        dinosaurs: mergeDeep(defaultConfig.dinosaurs, realConfig.dinosaurs)
      }
    )
  }),
  test('mapDefaultUsers', () => {
    const defaultConfig = {
      users: {
        snoopy: {
          permissions: {
            a: 'World War I Flying Ace'
          }
        },
        schroeder: {
          permissions: {
            a: 'Jam'
          }
        }
      }
    };
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
    expect(
      mergeDeep(
        // Duplicate snoopy key to linus and lucy and duplicate schroeder key to pigpen
        // Once duplicated we can correctly merge
        mapDefaultUsers({
          snoopy: R.pick(['linus', 'lucy'], realUsers),
          'schroeder': R.pick(['pigpen'], realUsers)
        }, defaultConfig),
        {users: realUsers}
      )
    ).toEqual(
      {
        users: {
          linus: {
            permissions: {
              a: 'World War I Flying Ace',
              b: 'Security Blanket'
            }
          },
          lucy: {
            permissions: {
              a: 'World War I Flying Ace',
              b: 'Psychiatrist'
            }
          },
          pigpen: {
            permissions: {
              a: 'Jam',
              b: 'Stink'
            }
          },
        }
      }
    )
  })
});
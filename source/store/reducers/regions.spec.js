import reducer from 'store/reducers/mapbox'
import {Map} from 'immutable'
import testConfig from 'store/data/test/config'
import initialState from 'store/data/initialState'
import {getPath} from 'helpers/functions'

describe('mabpox reducer', () => {
    it('should return the initial state', () => {
        const state = initialState(testConfig);
        expect(
            Map(reducer(
                getPath(['regions', getPath(['regions', 'currentKey'], state), 'mapbox'], state),
                {})
            ).toJS()
        ).toEqual(testConfig.mapbox)
    });
    // This is really internal to redux-map-gl's reducer, but good to have here to document what
    // it does
    it('should handle CHANGE_VIEWPORT', () => {
        expect(
            Map(reducer(
                {
                    viewport: Map({
                        zoom: 1,
                        latitude: 2,
                        longitude: 3
                    })
                },
                {
                type: 'map/CHANGE_VIEWPORT',
                payload: {
                        mapState: {
                            zoom: 4,
                            latitude: 5,
                            longitude: 6
                        }
                }
            })).toJS()
        ).toEqual({
            viewport: {
                zoom: 4,
                latitude: 5,
                longitude: 6
            }
        })
    })
});

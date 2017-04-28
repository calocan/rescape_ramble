import reducer from 'store/reducers/mapbox'
import {Map} from 'immutable'
import currentConfig from 'store/data/current/config'
import initialState from 'store/data/initialState'
import {getPath} from 'helpers/functions'

describe('mabpox reducer', () => {
    it('should return the initial state', () => {
        expect(
            Map(reducer(
                getPath(['regions', 'current', 'mapbox'], initialState(currentConfig)),
                {})
            ).toJS()
        ).toEqual(currentConfig.mapbox)
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

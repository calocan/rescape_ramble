import reducer from 'store/reducers/mapbox'
import config from 'store/data/default/config'
import {Map} from 'immutable'

describe('mabpox reducer', () => {
    it('should return the initial state', () => {
        expect(
            Map(reducer(undefined, {})).toJS()
        ).toEqual(
            {viewport: config.mapbox.viewport}
        )
    });
    it('should handle CHANGE_VIEWPORT', () => {
        expect(
            reducer({}, {
                type: 'map/CHANGE_VIEWPORT',
                mapState: {
                    zoom: 4,
                    latitude: 5,
                    longitude: 6
                }
            })
        ).toEqual({
            mapState: {
                zoom: 4,
                latitude: 5,
                longitude: 6
            }
        })
    })
});

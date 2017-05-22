import reducer from 'store/reducers/regions'
import {Map} from 'immutable'
import testConfig from 'store/data/test/config'
import initialState from 'store/data/initialState'
import {getPath} from 'helpers/functions'

describe('mabpox reducer', () => {
    it('should return the initial state', () => {
        const state = initialState(testConfig);
        expect(
            Map(reducer(
                state.regions,
                {})
            ).toJS()
        ).toMatchSnapshot();
    });
    // This is really internal to redux-map-gl's reducer, but good to have here to document what
    // it does
    it('should handle CHANGE_VIEWPORT', () => {
        const state = initialState(testConfig);
        const viewport = {
            bearing: 0,
            isDragging: false,
            latitude: 5,
            longitude:6,
            pitch: 40,
            startDragLngLat: null,
            zoom: 4
        }
        expect(
            getPath(
                [getPath(['regions', 'currentKey'], state), 'mapbox', 'viewport'],
                reducer(
                    state.regions,
                    {
                    type: 'map/CHANGE_VIEWPORT',
                    payload: {
                            mapState: viewport
                    }
                })).toJS()
        ).toEqual(
            viewport
        )
    })
});

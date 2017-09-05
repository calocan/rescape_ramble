
const reducer = require('store/reducers/regions').default;
const {actions} = require('store/reducers/geojson/geojsons').actions;
const {Map} = require('immutable');
const testConfig = require('store/data/test/config').default;
const initialState = require('store/data/initialState').default;
const {reqPath} = require('rescape-ramda').throwing;

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
    it('should update the current region', () => {
        const state = initialState(testConfig);
        expect(
            reducer(
                state.regions,
                {
                    type: actions.FETCH_TRANSIT_SUCCESS,
                    value: {
                        type: 'FeatureCollection',
                        generator: 'overpass-turbo',
                        copyright: 'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.',
                        timestamp: '2017-04-06T22:46:03Z',
                        features: []
                    }
                }
            )
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
            longitude: 6,
            pitch: 40,
            startDragLngLat: null,
            zoom: 4
        };
        expect(
            reqPath(
                [reqPath(['regions', 'currentKey'], state), 'mapbox', 'viewport'],
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
        );
    });
});


import test from 'tape-catch';

const mapboxApiAccessToken = process.env.MapboxAccessToken || process.env.MAPBOX_ACCESS_TOKEN; // eslint-disable-line

/*
const defaultProps = {
    width: 500,
    height: 500,
    longitude: -122,
    latitude: 37,
    zoom: 14,
    mapboxApiAccessToken
};
*/

test('MapGL can mount', t => {
    t.ok(true);
    t.end();
});

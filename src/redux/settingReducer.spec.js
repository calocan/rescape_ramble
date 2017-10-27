const {SET_CURRENT, setState, setCurrent} = require('./settingReducer');
const {SET_STATE} = require('redux/fullStateReducer');

describe('settingReducer', () => {
    it('should create an action to set the state', () =>{
        const state = {
            foo: 1,
            bar: 2
        };
        expect(setState(state)).toEqual({
            type: SET_STATE,
            state
        });
    });
    it('should create an action to set current', () => {
        const regionKey = 'california';
        expect(setCurrent(regionKey)).toEqual({
            type: SET_CURRENT,
            regionKey
        });
    });
});

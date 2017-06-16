import {SET_CURRENT, setState, setCurrent} from './settings';
import {SET_STATE} from 'store/reducers/fullStates';

describe('settings actions', () => {
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
    it('should create an action to set foo', () => {
        const value = 1;
        expect(setCurrent(value)).toEqual({
            type: SET_CURRENT,
            value
        });
    })
});

/**
 *
 */
const R = require('ramda');
const Task = require('data.task')
import {expectTask} from "./jestHelpers";
describe('research', () => {
    test('lift can be used with Task', async () => {
        const lift2 = R.liftN(2, (a, b) => {
            return R.add(a, b)
        });
        expect.assertions(1);
        // See if we can add to Tasks together using lift
        await expectTask(lift2(
            Task.of(2),
            new Task((rej, res) => setTimeout(() => res(3) )))
        ).resolves.toEqual(5)
    })
})

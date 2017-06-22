/**
 *
 */
const R = require('ramda');
const Task = require('data.task')
import {taskToPromise} from "./functions";
describe('research', () => {
    test('lift can be used with Task', () => {
        const lift2 = R.liftN(2, (a, b) => {
            return R.add(a, b)
        });
        expect.assertions(1);
        return taskToPromise(lift2(
            Task.of(2),
            new Task((rej, res) => setTimeout(() => {
                res(3)
            }))))
        .then(data => {
            expect(data).toEqual(5)
        })
    })
})

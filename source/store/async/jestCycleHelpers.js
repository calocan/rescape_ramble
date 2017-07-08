import {mockTimeSource} from '@cycle/time/most';
import {testStreamLength} from "../../helpers/jestHelpers";
import {combine, from} from "most";
import R from 'ramda'

// Modified from
// https://github.com/cyclejs-community/redux-cycles/blob/master/example/cycle/test/helpers.js

/***
 *
 * @param sources Diagram Mapping of the Cycle sources to assert in a form like this:
 * {
        ACTION: { 'ab|': actionSource },
        HTTP:   { '--|': httpSource }
   }
    where the key matches the source/sink Key, the inner key is the Time diagram string, and the inner
    value is a sourceOpts representation in form like this:
   {
        a: actions.requestReposByUser(user1), // returns a {} or func
        b: actions.requestReposByUser(user2)
   }
    where the key matches those in the diagram and the value an object result based
    on calling a Redux action or a func result like this for HTTP:
        () => ({
          r: xs.of({ body: { items: ['foo'] } })
        })
 * @param sinks A Diagram Mapping of expected Sinks in a form like:
 * {
 *  HTTP:   { 'xy|': httpSink }
 * }
 * where the key matches an expected sink key, the inner key is a diagram mapping keys to values
 * in the inner value, which is a Sync representation in a form like this:
 * {
    x: {
      url: `https://api.github.com/users/${user1}/repos`,
      category: 'users'
    },
    y: {
      url: `https://api.github.com/users/${user2}/repos`,
      category: 'users'
    }
  };
    where the keys match those in the diagram string, and the values are the expected sync value
    to be produced by corresponding source
 * @param main The Cycle main function, which is called with sources and a mock timeSource
 * @param done Jest done() function to call after the assertion
 * @param {Object} Optional timeOpts Supplied to mockTimeSource
 */
export function assertSourcesSinks(sources, sinks, main, done, timeOpts = {}) {
    // Mock a Time Source
    const timeSource = mockTimeSource(timeOpts);
    const _sources = Object.keys(sources)
    // e.g. sourceKey is 'ACTION' or 'HTTP'
        .reduce((_sources, sourceKey) => {
            // Extract the object, e.g.
            // {'ab|': {
            //  a: actions.requestReposByUser(user1),
            //  b: actions.requestReposByUser(user2)
            //  }} or
            //  '--|': {
            //      select: () => ({
            //          r: xs.of(response)
            //      })
            //  }}
            const sourceObj = sources[sourceKey];
            // Extract the source's only key to use in a Time diagram,
            // e.g. 'ab|'
            const diagramStr = Object.keys(sourceObj)[0];
            // Get the value associated with that key to use as options
            // e.g.
            // {
            //  a: actions.requestReposByUser(user1), (returns obj)
            //  b: actions.requestReposByUser(user2)
            // }
            // or
            // select: () => ({
            //  r: xs.of(response)
            // })
            const sourceOpts = sourceObj[diagramStr];

            let obj = {};
            // Take the first key of the sourceOpts e.g. 'a' or 'select'
            let firstKey = Object.keys(sourceOpts)[0];
            if (typeof sourceOpts[firstKey] === 'function') {
                // If the action call returns a function return an object with the Source key
                // valued by the single key/func, the first sourceOpts key and valued by the Diagram call,
                // which itself is called with the Diagram key and key mappings
                // e.g.
                // {
                //  HTTP:
                //      {select: () => diagram('--|', {r: xs.of()response)}}
                //  })
                obj = {
                    [sourceKey]:
                        R.map(
                            value => () => timeSource.diagram(diagramStr, value()),
                                //.tap( i => console.log(`Source: ${sourceKey}`, i) );
                            sourceOpts
                        )
                }
            } else {
                // Else the action call returns an object make an object keyed by the Source key and valued
                // by the Time Diagram, which itself is called with the Diagram key and key mappings
                // e.g.
                // {
                //  ACTIONS: diagram('ab|', {a: actions.requestReposByUser(user1)), b: actions.requestReposByUser(user2)})
                //  }
                obj = {
                    [sourceKey]: timeSource.diagram(diagram, sourceOpts)
                    //.tap( i => console.log(`Source: ${sourceKey}`, i) );
                }
            }

            // Reduce each Source object
            // Thus we return something like
            // {
            //  sourceA: sourceOpts1stKey: () => diagram(sourceASource1stKey1, sourceOptions1stValue)
            //  sourceB: sourceOpts1stKey: diagram(sourceASource1stKey1, sourceOptions)
            // }
            return Object.assign(_sources, obj);
        }, {})

    // Reduce the sinks into an object in the following format
    // {
    //  sinkA: diagram(sinkAObj1stKey, sinkAObj1stValue)
    //  sinkB: diagram(sinkBkObj1stKey, sinkBObj1stValue)
    // }
    const _sinks = Object.keys(sinks)
        .reduce((_sinks, sinkKey) => {
            const sinkObj = sinks[sinkKey];
            const diagram = Object.keys(sinkObj)[0];
            const sinkOpts = sinkObj[diagram];

            return Object.assign(_sinks, {[sinkKey]: timeSource.diagram(diagram, sinkOpts)});
        }, {});

    // Add TimeSource as a source
    _sources.Time = timeSource;

    // Run the sources through _main. This gives us the actual sink results
    const _main = main(_sources);


    // Assert that each expected sink Time diagram matches
    // the actual sync results produced by main
    Object.keys(sinks)
        .map(sinkKey => {
            timeSource.assertEqual(_main[sinkKey], _sinks[sinkKey])
        });

    // Run the time source and ensure no errors
    timeSource.run(err => {
        expect(err).toBeFalsy();
        done();
    });
}

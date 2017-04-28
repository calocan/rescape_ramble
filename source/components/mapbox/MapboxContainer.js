/**
 * Created by Andy Likuski on 2017.02.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {onChangeViewport} from 'redux-map-gl';
import React from 'react';
import createMapbox from './Mapbox';
import R from 'ramda';
import {toJS} from 'helpers/functions';

/***
 * Merges state.mapbox with ownProps, but raises level of state
 * @param state
 * @param ownProps
 */
export const mapStateToProps = (state, ownProps) =>
    R.merge(
        // Flatten viewport and remove immutable
        toJS(ownProps.region.mapbox.viewport),
        R.omit(['viewport'], state.mapbox)
    );

// This is just an example of what mapDispatchToProps does.
const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        /*
        doFooThingInComponent: () => {
            dispatch(someImportedAction(
                ownProps.somePropertyOfContainerOrParent,
                ownProps.someOtherPropertyOfContainerOrParent
            ));
        },
        */
        // Pass this straight through
        onChangeViewport
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(createMapbox(React));

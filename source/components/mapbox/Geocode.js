import React from 'react'
import autobind from 'autobind-decorator';
import styles from './Geocode.style'

/**
 * Moderinzied from broken react-geocode project
 * Geocoder component: connects to Mapbox.com Geocoding API
 * and provides an autocompleting interface for finding locations.
 */
class Geocode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            results: [],
            focus: null,
            loading: false,
            searchTime: new Date()
        };
    }

    @autobind
    onInput(e) {
        this.setState({loading:true});
        var value = e.target.value;
        if (value === '' || !value) {
            this.textInput.value = null;
            this.setState({
                results: [],
                focus: null,
                loading:false
            });
        } else {
            this.props.search(
                this.props.endpoint,
                this.props.source,
                this.props.accessToken,
                this.props.proximity,
                value,
                this.onResult).fork(
                    error => {
                        this.props.searchFailure(error);
                    },
                    (response, body, searchTime) => {
                        this.onResult(body, searchTime);
                    }
            );
        }
    }
    moveFocus(dir) {
        if(this.state.loading) return;
        this.setState({
            focus: this.state.focus === null ?
                0 : Math.max(0,
                    Math.min(
                        this.state.results.length - 1,
                        this.state.focus + dir))
        });
    }
    acceptFocus() {
        if (this.state.focus !== null) {
            this.props.onSelect(this.state.results[this.state.focus]);
        }
    }
    onKeyDown(e) {
        switch (e.which) {
            // up
            case 38:
                e.preventDefault();
                this.moveFocus(-1);
                break;
            // down
            case 40:
                this.moveFocus(1);
                break;
            // accept
            case 13:
                if( this.state.results.length > 0 && this.state.focus == null) {
                    this.clickOption(this.state.results[0],0);
                }
                this.acceptFocus();
                break;
        }
    }
    onResult(body, searchTime) {
        // searchTime is compared with the last search to set the state
        // to ensure that a slow xhr response does not scramble the
        // sequence of autocomplete display.
        if (body && body.features && this.state.searchTime <= searchTime) {
            this.setState({
                searchTime: searchTime,
                loading: false,
                results: body.features,
                focus: null
            });
            this.props.onSuggest(this.state.results);
        }
    }
    clickOption(place, listLocation) {
        this.props.onSelect(place);
        this.setState({focus:listLocation});
        // focus on the input after click to maintain key traversal
        this.textInput.focus();
        this.textInput.value = place.text;
        return false;
    }
    render() {
        const input = <input
            ref={(input) => { this.textInput = input; }}
            style={styles.inputContainer}
            className={this.props.inputClass}
            onInput={this.onInput}
            onKeyDown={this.onKeyDown}
            placeholder={this.props.inputPlaceholder}
            type='text' />;
        return (
            <div>
                {this.props.inputPosition === 'top' && input}
                {this.state.results.length > 0 && (
                    <ul className={`${this.props.showLoader && this.state.loading ? 'loading' : ''} ${this.props.resultsClass}`}>
                        {this.state.results.map((result, i) => (
                            <li key={result.id}>
                                <a href='#'
                                   onClick={this.clickOption.bind(this, result, i)}
                                   className={this.props.resultClass + ' ' + (i === this.state.focus ? this.props.resultFocusClass : '')}
                                   key={result.id}>{result.place_name}</a>
                            </li>
                        ))}
                    </ul>
                )}
                {this.props.inputPosition === 'bottom' && input}
            </div>
        );
    }
};

Geocode.defaultProps = {
    endpoint: 'https://api.mapbox.com',
    inputClass: '',
    resultClass: '',
    resultsClass: '',
    resultFocusClass: 'strong',
    inputPosition: 'top',
    inputPlaceholder: 'Find Location',
    showLoader: false,
    source: 'mapbox.places',
    proximity: '',
    onSuggest: function() {}
}

Geocode.proptypes = {
    endpoint: React.PropTypes.string,
    source: React.PropTypes.string,
    inputClass: React.PropTypes.string,
    resultClass: React.PropTypes.string,
    resultsClass: React.PropTypes.string,
    inputPosition: React.PropTypes.string,
    inputPlaceholder: React.PropTypes.string,
    resultFocusClass: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired,
    onSuggest: React.PropTypes.func,
    accessToken: React.PropTypes.string.isRequired,
    proximity: React.PropTypes.string,
    showLoader: React.PropTypes.bool,
    focusOnMount: React.PropTypes.bool
}
export default Geocode

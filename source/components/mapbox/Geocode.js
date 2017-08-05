import React from 'react'
import autobind from 'autobind-decorator';
import styles from './Geocode.style'
import PropTypes from 'prop-types'

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

    onInput(e) {
        this.setState({ loading: true });
        var value = e.target.value;
        if (value === '' || !value) {
            this.textInput.value = null;
            this.setState({
                results: [],
                focus: null,
                loading: false
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
        if (this.state.loading) {
            return;
        }
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
                if (this.state.results.length > 0 && this.state.focus === null) {
                    this.clickOption(this.state.results[0], 0);
                }
                this.acceptFocus();
                break;
            default:
                return
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
        this.setState({ focus: listLocation });
        // focus on the input after click to maintain key traversal
        this.textInput.focus();
        this.textInput.value = place.text;
        return false;
    }
    render() {
        const inputJsx = <input
            ref={(input) => { this.textInput = input; }}
            style={styles.inputContainer}
            className={this.props.inputClass}
            onInput={this.onInput.bind(this)}
            onKeyDown={this.onKeyDown}
            placeholder={this.props.inputPlaceholder}
            type='text' />;
        return (
            <div>
                {this.props.inputPosition === 'top' && inputJsx}
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
                {this.props.inputPosition === 'bottom' && inputJsx}
            </div>
        );
    }
}

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
    endpoint: PropTypes.string,
    source: PropTypes.string,
    inputClass: PropTypes.string,
    resultClass: PropTypes.string,
    resultsClass: PropTypes.string,
    inputPosition: PropTypes.string,
    inputPlaceholder: PropTypes.string,
    resultFocusClass: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onSuggest: PropTypes.func,
    accessToken: PropTypes.string.isRequired,
    proximity: PropTypes.string,
    showLoader: PropTypes.bool,
    focusOnMount: PropTypes.bool
}
export default Geocode

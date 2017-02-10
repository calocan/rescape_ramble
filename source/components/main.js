import React, { Component } from 'react';
import MapBox from './mapBox/index';
import styles from './main.style';

export default class Main extends Component {

  render() {
    return (
      <div style={styles.container} >
        <MapBox />
      </div>
    );
  }
}

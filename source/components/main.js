import React, { Component } from 'react';
import MapBox from './mapBox/index';
import styles from './main.style';

export default class Main extends Component {

  render() {
    // Convert percent to pixel.
    const size = {
        width: styles.container.width * document.documentElement.clientWidth,
        height: styles.container.height * document.documentElement.clientHeight
    }
    return (
      <div style={Object.assign(styles.container, size)} >
        {/* We pass the container width and height so the map can track changes to these */}
        <MapBox {...size}/>
      </div>
    );
  }
}

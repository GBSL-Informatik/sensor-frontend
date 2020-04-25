import React from "react";
import "./styles.css";
import socketioClient from "socket.io-client";
import LineGraph from "./components/LineGraph";

export const API_URL = "localhost:4001";

export default class App extends React.Component {
  state = {
    motionData: []
  };

  constructor() {
    super();
    this.socket = socketioClient(API_URL);
  }

  componentDidMount() {
    this.socket.on("motion_data", data => this.setState({ motionData: data }));
    window.ondevicemotion = this.onDevicemotion;
  }

  onDevicemotion = (e) => {
    const motionData = {
      timeStamp: e.timeStamp,
      x: e.accelerationIncludingGravity.x,
      y: e.accelerationIncludingGravity.y,
      z: e.accelerationIncludingGravity.z
    };
    this.socket.emit("new_motion_data", motionData);
  };

  render() {
    return (
      <div className="App">
        <h1>Socket Wordcloud <button onClick={() => this.socket.emit('clear_motion_data')}>Clear</button></h1>
        <LineGraph motionData={this.state.motionData} />
      </div>
    );
  }
}

import React from "react";
import "./styles.css";
import socketioClient from "socket.io-client";
import LineGraph from "./components/LineGraph";
import SensorConfig from "./components/SensorConfig";

export const API_URL = "http://localhost:4001";

export default class App extends React.Component {
  state = {
    motionData: [],
    deviceName: Math.random().toString(36).substr(2, 5),
    displayDevice: '',
    devices: []
  };

  constructor() {
    super();
    this.socket = socketioClient(API_URL);
  }

  componentDidMount() {
    this.socket.on("motion_devices", data => this.setState({ devices: data }));
    this.socket.on("motion_data", data => {
      if (data) {
        this.setState({ motionData: data })
      }
    });
    /**
     * register my device
     */
    this.socket.emit('new_device', { name: this.state.deviceName });
    // join the datastream of my device
    this.setDisplayDevice(this.state.deviceName);

    /**
     * register the browser as a device motion listener
     * this.onDevicemotion is called on every new sensor value
     */
    window.ondevicemotion = this.onDevicemotion;
  }

  onDevicemotion = (e) => {
    const motionData = {
      name: this.state.deviceName,
      timeStamp: e.timeStamp,
      x: e.accelerationIncludingGravity.x,
      y: e.accelerationIncludingGravity.y,
      z: e.accelerationIncludingGravity.z
    };
    this.socket.emit("new_motion_data", motionData);
  };

  setDisplayDevice = (deviceName) => {
    // subscribe to the new sensor data
    this.socket.emit('display_device', { name: deviceName, oldDevice: this.state.displayDevice });
    // save the displayDevice locally
    this.setState({ displayDevice: deviceName });
  }

  clearMotionData = () => {
    this.socket.emit('clear_motion_data', { name: this.state.displayDevice })
  }

  render() {
    return (
      <div className="App">
        <h1>Socket Sensor Stream</h1>
        <button onClick={this.clearMotionData}>Clear</button>
        <SensorConfig
          setDisplayDevice={this.setDisplayDevice}
          devices={this.state.devices}
          deviceName={this.state.deviceName}
          displayDevice={this.state.displayDevice}
        />
        <LineGraph motionData={this.state.motionData} />
      </div>
    );
  }
}

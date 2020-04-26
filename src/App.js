import React from "react";
import "./styles.css";
import socketioClient from "socket.io-client";
import LineGraph from "./components/LineGraph";
import SensorConfig from "./components/SensorConfig";
import MotionSimulator from "./Simulator";

export const API_URL = "http://localhost:4001";

export default class App extends React.Component {
  deviceName = Math.random().toString(36).substr(2, 5).toUpperCase();

  state = {
    motionData: [],
    displayDevice: '',
    devices: [],
    useSimulatedDeviceMotion: false
  };

  constructor() {
    super();
    this.socket = socketioClient(API_URL);
  }

  componentDidMount() {
    this.deviceSimulator = document.getElementById('DeviceSimulator');

    /**
     * configure how to treat to new messages from the server 
     */
    this.socket.on("motion_devices", data => this.setState({ devices: data }));
    this.socket.on("motion_data", data => {
      if (data) {
        this.setState({ motionData: data })
      }
    });

    /**
     * register my device
     */
    this.socket.emit('new_device', { name: this.deviceName });
    /**
     * ensure to receive the latest version of motion devices
     */
    this.socket.emit('get_devices');

    /**
     * join the datastream of my device
     */
    this.setDisplayDevice(this.deviceName);

    /**
     * register a function that is called whenever the window emits a
     * device motion event (e.g. whenever a new sensorvalue is present)
     */
    window.addEventListener('devicemotion', this.onDevicemotion, true)
  }

  componentWillUnmount() {
    /**
     * cleanup - remove the eventlistener
     */
    window.removeEventListener('devicemotion', this.onDevicemotion, true);
    this.socket.emit("remove_device", { name: this.deviceName });
  }

  onDevicemotion = (e) => {
    const motionData = {
      name: this.deviceName,
      timeStamp: e.timeStamp,
      x: e.accelerationIncludingGravity.x,
      y: e.accelerationIncludingGravity.y,
      z: e.accelerationIncludingGravity.z
    };
    this.socket.emit("new_motion_data", motionData);
  };

  toggleUseSimulatedDeviceMotion = () => {
    const deviceSimulator = document.getElementById('DeviceSimulator');
    if (!deviceSimulator) {
      return;
    }

    const useSimulator = !this.state.useSimulatedDeviceMotion;
    this.setState({ useSimulatedDeviceMotion: useSimulator });
    if (useSimulator) {
      window.removeEventListener('devicemotion', this.onDevicemotion, true);
      deviceSimulator.addEventListener('devicemotion', this.onDevicemotion, true);
      const simulator = new MotionSimulator();
      this.setState({
        simulator: simulator
      });
    } else {
      deviceSimulator.removeEventListener('devicemotion', this.onDevicemotion, true);
      window.addEventListener('devicemotion', this.onDevicemotion, true);
      if (this.state.simulator) {
        this.state.simulator.stopSimulation();
        this.setState({
          simulator: undefined
        });
      }
    }
  }

  setDisplayDevice = (deviceName) => {
    // subscribe to the new sensor data
    this.socket.emit(
      'display_device',
      {
        name: deviceName,
        oldDevice: this.state.displayDevice
      }
    );
    // save the displayDevice locally
    this.setState({ displayDevice: deviceName });
  }

  clearMotionData = () => {
    this.socket.emit('clear_motion_data', { name: this.state.displayDevice })
  }

  clearDevices = () => {
    const response = window.confirm("Do you really want to clear all devices?");
    if (response === true) {
      this.socket.emit('clear_devices');
      this.socket.emit('new_device', { name: this.deviceName });
      this.socket.emit('get_devices');
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Socket Sensor Stream</h1>
        <span>
          <button onClick={this.clearMotionData}>Clear current Motion Data</button>
          <button onClick={this.clearDevices}>Clear Devices</button>
        </span>
        <SensorConfig
          setDisplayDevice={this.setDisplayDevice}
          devices={this.state.devices}
          deviceName={this.deviceName}
          displayDevice={this.state.displayDevice}
          toggleUseSimulatedDeviceMotion={this.toggleUseSimulatedDeviceMotion}
          useSimulatedDeviceMotion={this.state.useSimulatedDeviceMotion}
        />
        <LineGraph motionData={this.state.motionData} />
      </div>
    );
  }
}

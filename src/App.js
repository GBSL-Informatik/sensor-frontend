import React from "react";
import "./styles.css";
import socketioClient from "socket.io-client";
import LineGraph from "./components/LineGraph";
import SensorConfig from "./components/SensorConfig";
import MotionSimulator from "./Simulator";

export const API_URL = "http://localhost:4001";

export default class App extends React.Component {
  /**
   * Generate a random string with 5 characters as the device id
   */
  deviceId = Math.random().toString(36).substr(2, 5).toUpperCase();

  state = {
    motionData: [],
    displayDeviceId: undefined,
    devices: [],
    useSimulatedDeviceMotion: false
  };

  componentDidMount() {
    this.socket = socketioClient(API_URL);

    /**
     * register my device
     */
    this.socket.emit("new_device", { deviceId: this.deviceId });
    /**
     * ensure to receive the latest version of motion devices
     */

    /**
     * configure how to treat to new messages from the server 
     */
    this.socket.on("motion_devices", data => {
      this.setMotionDevices(data);
    });

    this.socket.emit("get_devices");

    this.socket.on("motion_data", data => {
      if (data) {
        this.setState({ motionData: data })
      }
    });

    /**
     * register a function that is called whenever the window emits a
     * device motion event (e.g. whenever a new sensorvalue is present)
     */
    window.addEventListener("devicemotion", this.onDevicemotion, true)
  }

  setMotionDevices(motionDevices) {
    this.setState({ devices: motionDevices })
    // when the currently observed device is not present,
    // display the data of my own device
    if (!motionDevices.includes(this.state.displayDeviceId)) {
      this.setDisplayDevice(this.deviceId);
    }
  }

  onDevicemotion = (e) => {
    const motionData = {
      deviceId: this.deviceId,
      timeStamp: e.timeStamp,
      x: e.accelerationIncludingGravity.x,
      y: e.accelerationIncludingGravity.y,
      z: e.accelerationIncludingGravity.z
    };
    this.socket.emit("new_motion_data", motionData);
  };

  toggleUseSimulatedDeviceMotion = () => {
    const deviceSimulator = document.getElementById("DeviceSimulator");
    if (!deviceSimulator) {
      return;
    }

    const useSimulator = !this.state.useSimulatedDeviceMotion;
    this.setState({ useSimulatedDeviceMotion: useSimulator });
    if (useSimulator) {
      window.removeEventListener("devicemotion", this.onDevicemotion, true);
      deviceSimulator.addEventListener("devicemotion", this.onDevicemotion, true);
      const simulator = new MotionSimulator();
      this.setState({
        simulator: simulator
      });
    } else {
      deviceSimulator.removeEventListener("devicemotion", this.onDevicemotion, true);
      window.addEventListener("devicemotion", this.onDevicemotion, true);
      if (this.state.simulator) {
        this.state.simulator.stopSimulation();
        this.setState({
          simulator: undefined
        });
      }
    }
  }

  setDisplayDevice = (deviceId) => {
    // subscribe to the new sensor data
    this.socket.emit(
      "display_device",
      {
        deviceId: deviceId,
        oldDeviceId: this.state.displayDeviceId
      }
    );
    // save the displayDeviceId locally
    this.setState({ displayDeviceId: deviceId });
  }

  clearMotionData = () => {
    this.socket.emit("clear_motion_data", { deviceId: this.state.displayDeviceId })
  }

  render() {
    return (
      <div className="App">
        <h1>Socket Sensor Stream</h1>
        <button onClick={this.clearMotionData}>Clear current Motion Data</button>
        <SensorConfig
          setDisplayDevice={this.setDisplayDevice}
          devices={this.state.devices}
          deviceId={this.deviceId}
          displayDeviceId={this.state.displayDeviceId}
          toggleUseSimulatedDeviceMotion={this.toggleUseSimulatedDeviceMotion}
          useSimulatedDeviceMotion={this.state.useSimulatedDeviceMotion}
        />
        <LineGraph motionData={this.state.motionData} />
      </div>
    );
  }
}

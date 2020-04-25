import React from "react";

export default class SensorConfig extends React.Component {
  chartWrapper = React.createRef();

  changeDisplayDevice() {
    this.props.setDisplayDevice(this.state.deviceName);
  }

  render() {
    return (
      <div className="sensor-config">
        <div>Device Name: <b>{this.props.deviceName}</b></div>

        <label htmlFor="devices">Choose a display device:</label>
        <select
          id="devices"
          onChange={(e, device) =>  this.props.setDisplayDevice(e.target.value)}
          value={this.props.displayDevice}
        >
          {
            this.props.devices.map(device => {
              return (
                <option
                  key={device}
                  value={device}
                >
                  {device}
                </option>
              )
            })
          }
        </select>
      </div>
    );
  }
}

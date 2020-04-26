import React from "react";

export default class SensorConfig extends React.Component {
  chartWrapper = React.createRef();

  render() {
    return (
      <div className="sensor-config">
        <div>My Device Name: <b>{this.props.deviceId}</b></div>

        <span>
          <label htmlFor="devices">Choose a display device: </label>
          <select
            id="devices"
            onChange={(e, device) => this.props.setDisplayDevice(e.target.value)}
            value={this.props.displayDeviceId}
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
        </span>
        <span>
          <label htmlFor="use-simlated-devicemotion">Use simulated Device Motion</label>
          <input
            id="use-simlated-devicemotion"
            type="checkbox"
            onChange={this.props.toggleUseSimulatedDeviceMotion}
            checked={this.props.useSimulatedDeviceMotion}
          />
        </span>
      </div>
    );
  }
}

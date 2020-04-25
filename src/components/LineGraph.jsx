import React from "react";
import { LineChart, Line, XAxis, Legend, YAxis, Tooltip } from 'recharts';
import _ from 'lodash';

export default class Wordcloud extends React.Component {
  chartWrapper = React.createRef();
  state = {
    width: 600
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.setState({ width: this.chartWrapper.current.clientWidth });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = (event) => {
    this.setState({ width: this.chartWrapper.current.clientWidth });
  };

  get data() {
    return this.props.motionData;
  }

  render() {
    const data = this.data;
    return (
      <div className="word-cloud" ref={this.chartWrapper} style={{ width: '100%' }}>
        {data.length > 0 && (
          <LineChart
            width={this.state.width}
            height={400}
            domain = {['auto', 'auto']}
            data={data}
            margin={{ top: 20, right: 5, left: -20, bottom: 5 }}
          >
            <XAxis
             dataKey="timeStamp"
             tickFormatter={(t) => Number(t/1000).toFixed(0) }
             interval={30}
             />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="x"
              dot={false}
              stroke="#ff0000"
            />
            <Line
              type="monotone"
              dataKey="y"
              dot={false}
              stroke="#00ff00"
            />
            <Line
              type="monotone"
              dataKey="z"
              dot={false}
              stroke="#0000ff"
            />
          </LineChart>
        )}
      </div>
    );
  }
}

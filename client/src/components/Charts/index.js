import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  XAxis, YAxis, CartesianGrid, Bar, BarChart, ResponsiveContainer, Tooltip,
} from 'recharts';
import { Query } from 'react-apollo';
import { getProductsReport } from '../../apollo/gql/product';
import { getWorkersReport } from '../../apollo/gql/workers';
import './style.css';

class CustomTick extends Component {
  static propTypes = {
    dateRange: PropTypes.arrayOf(PropTypes.string),
  };

  render() {
    const { x, y, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={-10} dy={16} textAnchor="end" fill="#666" transform="rotate(90)">
          {payload.value}
        </text>
      </g>
    );
  }
}

class Charts extends Component {
  static propTypes = {};

  getMinutesSum = worker => worker.operations.reduce(
    (acc, operation) => acc + operation.price * operation.product.count,
    0,
  );

  render() {
    return (
      <Query
        query={getProductsReport}
        variables={{ dateRange: this.props.dateRange }}
        fetchPolicy="network-only">
        {({ error: errorOne, data: { productsReport } }) => (
          <Query
            query={getWorkersReport}
            variables={{ dateRange: this.props.dateRange }}
            fetchPolicy="network-only">
            {({ error: errorTwo, data: { workersReport } }) => {
              if (errorOne || errorTwo) return 'Error!';
              return (
                <div className="charts-container">
                  <ResponsiveContainer width="100%" height="45%">
                    <BarChart
                      data={productsReport && productsReport.report}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}>
                      <Tooltip />
                      <XAxis
                        dataKey="vendorCode"
                        tick={<CustomTick />}
                        interval={0}
                        mirror={true}
                      />
                      <YAxis label={{ value: 'Количество', angle: -90 }} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey="count" fill="#8884d8" fillOpacity="0.4" />
                    </BarChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height="45%" className="workers-container">
                    <BarChart
                      data={workersReport}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}>
                      <Tooltip />
                      <XAxis dataKey="surname" />
                      <YAxis dataKey={worker => this.getMinutesSum(worker)} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey={worker => this.getMinutesSum(worker)} fill="#1DA57A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            }}
          </Query>
        )}
      </Query>
    );
  }
}

export default Charts;

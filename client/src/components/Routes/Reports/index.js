import React, { Component } from 'react';
import {
  Button, DatePicker, Layout, Tabs,
} from 'antd';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import WorkersReportsTable from '../../WorkersReportTable';
import ProductsReportsTable from '../../ProductsReportTable';
import Charts from '../../Charts';
import { DATE_FORMAT } from '../../../constants';
import './style.css';

const { Content } = Layout;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const now = new Date();
const defaultDateRange = [moment(now, DATE_FORMAT).subtract(1, 'month'), moment(now, DATE_FORMAT)];

class Reports extends Component {
  state = {
    dateRange: defaultDateRange.map(date => date.toISOString()),
    csvData: [],
    filename: 'workers.csv',
  };

  componentDidMount = async () => {
    const response = await fetch('http://localhost:4000/api/report', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateRange: this.state.dateRange, report: 'workers' }),
    });

    const csvData = await response.json();
    this.setState({
      csvData,
    });
  };

  onTabsChange = async (tab) => {
    if (tab === '1') {
      const response = await fetch('http://localhost:4000/api/report', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange: this.state.dateRange, report: 'workers' }),
      });

      const csvData = await response.json();
      this.setState({
        csvData,
        filename: 'workers.csv',
      });
    } else if (tab === '2') {
      const response = await fetch('http://localhost:4000/api/report', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange: this.state.dateRange, report: 'products' }),
      });

      const csvData = await response.json();
      this.setState({
        csvData,
        filename: 'products.csv',
      });
    }
  };

  onDateChange = (value) => {
    this.setState({
      dateRange: value.map(date => date.toISOString()),
    });
  };

  render() {
    const { csvData, filename } = this.state;
    return (
      <Content className="content">
        <div className="range-picker-container">
          <CSVLink data={csvData} filename={filename}>
            <Button type="primary" className="csv-button">
              Выгрузить csv
            </Button>
          </CSVLink>
          <RangePicker
            defaultValue={defaultDateRange}
            format={DATE_FORMAT}
            onChange={this.onDateChange}
          />
        </div>
        <Tabs defaultActiveKey="1" onChange={this.onTabsChange}>
          <TabPane tab="Отчет по сотрудникам" key="1">
            <WorkersReportsTable dateRange={this.state.dateRange} />
          </TabPane>
          <TabPane tab="Отчет по изделиям" key="2">
            <ProductsReportsTable dateRange={this.state.dateRange} />
          </TabPane>
          <TabPane tab="Графики" key="3">
            <Charts dateRange={this.state.dateRange} />
          </TabPane>
        </Tabs>
      </Content>
    );
  }
}

export default Reports;

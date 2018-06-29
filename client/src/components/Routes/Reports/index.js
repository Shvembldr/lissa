import React, { Component } from 'react';
import { DatePicker, Layout, Tabs } from 'antd';
import moment from 'moment';
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
  };

  onDateChange = (value) => {
    this.setState({
      dateRange: value.map(date => date.toISOString()),
    });
  };

  render() {
    return (
      <Content className="content">
        <div className="range-picker-container">
          <RangePicker
            defaultValue={defaultDateRange}
            format={DATE_FORMAT}
            onChange={this.onDateChange}
          />
        </div>
        <Tabs defaultActiveKey="1">
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

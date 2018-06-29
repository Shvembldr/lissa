import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import moment from 'moment';
import { DATE_FORMAT } from '../../constants';

const columns = [
  {
    title: 'Дата',
    key: 'date',
    render: (text, record) => moment(new Date(record.product.date)).format(DATE_FORMAT),
  },
  {
    title: 'Код',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Артикул',
    dataIndex: 'vendorCode',
    render: (text, record) => record.product.vendorCode,
  },
  {
    title: 'Количество',
    dataIndex: 'count',
    render: (text, record) => record.product.count,
  },
  {
    title: 'Сумма',
    key: 'sum',
    render: (text, record) => record.product.count * record.price,
  },
];

class WorkerTable extends Component {
  static propTypes = {
    operations: PropTypes.arrayOf(PropTypes.object),
  };

  render() {
    const { operations } = this.props;
    return (
      <Table
        style={{ backgroundColor: 'white' }}
        rowKey={worker => worker.id}
        dataSource={operations}
        columns={columns}
        pagination={false}
        size="small"
        bordered={true}
      />
    );
  }
}

export default WorkerTable;

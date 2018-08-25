import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { Query } from 'react-apollo';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { getWorkersReport } from '../../apollo/gql/workers';
import WorkerTable from '../WorkerTable';
import { DATE_FORMAT, TABLE_ROW_COUNT } from '../../constants';

const columns = [
  {
    title: 'Код',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Имя',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Фамилия',
    dataIndex: 'surname',
    key: 'surname',
  },
  {
    title: 'Количество минут',
    key: 'id',
    render: worker => worker.operations.reduce(
      (acc, operation) => acc + operation.price * operation.product.count,
      0,
    ),
  },
];

class WorkersReportsTable extends Component {
  static propTypes = {
    dateRange: PropTypes.arrayOf(PropTypes.string),
  };

  getFileNameAll = () => `workers-${this.props.dateRange.map(date => moment(date).format('MMM Do YYYY')).join('-')}.csv`;

  getFileNameWorker = record => `${record.surname}-${this.props.dateRange
    .map(date => moment(date).format('MMM Do YYYY'))
    .join('-')}.csv`;

  csvFormatAll = report => report.map(data => ({
    Код: data.code,
    Имя: data.name,
    Фамилия: data.surname,
    'Количество минут': data.operations.reduce(
      (acc, operation) => acc + operation.price * operation.product.count,
      0,
    ),
  }));

  csvFormatWorker = operations => operations.map(operation => ({
    Дата: moment(operation.date).format(DATE_FORMAT),
    Код: operation.code,
    Артикул: operation.product.vendorCode,
    Количество: operation.product.count,
    Сумма: operation.product.count * operation.price,
  }));

  render() {
    return (
      <Query
        query={getWorkersReport}
        variables={{ dateRange: this.props.dateRange }}
        fetchPolicy="network-only">
        {({ loading, error, data: { workersReport } }) => {
          if (error) return `Error! ${error.message}`;
          return (
            <Fragment>
              <CSVLink
                data={workersReport ? this.csvFormatAll(workersReport) : []}
                filename={this.getFileNameAll()}>
                <Button type="primary" className="csv-button">
                  Выгрузить csv
                </Button>
              </CSVLink>
              <Table
                rowKey={worker => worker.id}
                loading={loading}
                dataSource={workersReport}
                columns={columns}
                pagination={
                  workersReport && workersReport.length > TABLE_ROW_COUNT
                    ? { pageSize: TABLE_ROW_COUNT }
                    : false
                }
                expandedRowRender={record => (
                  <Fragment>
                    <CSVLink
                      data={this.csvFormatWorker(record.operations)}
                      filename={this.getFileNameWorker(record)}>
                      <Button type="primary" className="csv-button">
                        Выгрузить csv
                      </Button>
                    </CSVLink>

                    <WorkerTable operations={record.operations} />
                  </Fragment>
                )}
              />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default WorkersReportsTable;

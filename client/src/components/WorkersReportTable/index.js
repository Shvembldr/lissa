import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { Query } from 'react-apollo';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { getWorkersReport } from '../../apollo/gql/workers';
import WorkerTable from '../WorkerTable';
import { TABLE_ROW_COUNT } from '../../constants';

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

  getFileName = () => `workers-${this.props.dateRange.map(date => moment(date).format('MMM Do YYYY')).join('-')}.csv`;

  csvFormat = report => report.map(data => ({
    Код: data.code,
    Имя: data.name,
    Фамилия: data.surname,
    'Количество минут': data.operations.reduce(
      (acc, operation) => acc + operation.price * operation.product.count,
      0,
    ),
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
                data={workersReport ? this.csvFormat(workersReport) : []}
                filename={this.getFileName()}>
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
                expandedRowRender={record => <WorkerTable operations={record.operations} />}
              />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default WorkersReportsTable;

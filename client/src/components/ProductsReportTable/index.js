import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { Query } from 'react-apollo';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { getProductsReport } from '../../apollo/gql/product';
import { TABLE_ROW_COUNT } from '../../constants';

const columns = [
  {
    title: 'Артикул',
    dataIndex: 'vendorCode',
    key: 'vendorCode',
  },
  {
    title: 'Количество',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: 'Стоимость',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Сумма',
    dataIndex: 'sum',
    key: 'sum',
  },
];

class ProductsReportsTable extends Component {
  static propTypes = {
    dateRange: PropTypes.arrayOf(PropTypes.string),
  };

  getFileName = () => `products-${this.props.dateRange
    .map(date => moment(date).format('MMM Do YYYY'))
    .join('-')}.csv`;

  csvFormat = report => report.map(data => ({
    Код: data.vendorCode,
    Количество: data.count,
    Цена: data.price,
    Сумма: data.sum,
  }));

  render() {
    return (
      <Query
        query={getProductsReport}
        variables={{ dateRange: this.props.dateRange }}
        fetchPolicy="network-only">
        {({ loading, error, data: { productsReport } }) => {
          if (error) return `Error! ${error.message}`;
          return (
            <Fragment>
              <CSVLink
                data={productsReport ? this.csvFormat(productsReport.report) : []}
                filename={this.getFileName()}>
                <Button type="primary" className="csv-button">
                  Выгрузить csv
                </Button>
              </CSVLink>
              <Table
                rowKey={report => report.vendorCode}
                loading={loading}
                dataSource={productsReport && productsReport.report}
                columns={columns}
                pagination={
                  productsReport && productsReport.report.length > 8
                    ? { pageSize: TABLE_ROW_COUNT }
                    : false
                }
              />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ProductsReportsTable;

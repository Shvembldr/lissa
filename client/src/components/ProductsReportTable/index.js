import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { Query } from 'react-apollo';
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

  render() {
    return (
      <Query
        query={getProductsReport}
        variables={{ dateRange: this.props.dateRange }}
        fetchPolicy="network-only">
        {({ loading, error, data: { productsReport } }) => {
          if (error) return `Error! ${error.message}`;
          return (
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
          );
        }}
      </Query>
    );
  }
}

export default ProductsReportsTable;

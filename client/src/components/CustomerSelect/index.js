import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Select } from 'antd';
import { getCustomers } from '../../apollo/gql/customers';

// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;

class CustomerSelect extends Component {
  render() {
    const { value, ...restProps } = this.props;
    return (
      <Query query={getCustomers}>
        {({ loading, error, data }) => {
          if (loading) return <Select placeholder="загрузка..." style={{ width: 150 }} />;
          if (error) return `Error! ${error.message}`;
          return (
            <Select
              defaultValue={value}
              value={value}
              placeholder="Заказчик"
              style={{ width: 150 }}
              {...restProps}>
              {data.customers.map(customer => (
                <Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Option>
              ))}
            </Select>
          );
        }}
      </Query>
    );
  }
}

export default CustomerSelect;

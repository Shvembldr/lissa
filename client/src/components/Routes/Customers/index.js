import React, { Component } from 'react';
import {
  Button, Layout, message, Popconfirm, Table,
} from 'antd';
import { Mutation, Query } from 'react-apollo';
import Loading from '../../Loading';
import { updateCustomer, getCustomers, removeCustomers } from '../../../apollo/gql/customers';
import CustomersForm from '../../Forms/CustomersForm';
import EditableCell from '../../EditableCell';
import nameSorter from '../../../utils/nameSorter';
import { TABLE_ROW_COUNT } from '../../../constants';
import './style.css';

const { Content } = Layout;

const updateCacheRemoveCustomers = (cache, { data: { removeCustomers } }) => {
  const { customers } = cache.readQuery({ query: getCustomers });
  cache.writeQuery({
    query: getCustomers,
    data: {
      customers: customers.filter(customer => removeCustomers.indexOf(customer.id) === -1),
    },
  });
};

class Customers extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Группа',
        dataIndex: 'name',
        key: 'name',
        sorter: nameSorter('name'),
        render: (text, record) => (
          <Mutation mutation={updateCustomer}>
            {(updateCustomer, { loading }) => (
              <EditableCell
                loading={loading}
                value={text}
                onChange={async (name) => {
                  try {
                    await updateCustomer({
                      variables: { id: record.id, input: { name } },
                    });
                    message.success('Группа изменена');
                  } catch (e) {
                    message.error('Возникли сложности');
                    console.log(e);
                  }
                }}
              />
            )}
          </Mutation>
        ),
      },
    ];
  }

  state = {
    selectedRowKeys: [],
    loading: false,
    sortedInfo: {},
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Query query={getCustomers}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return `Error! ${error.message}`;
          return (
            <Content className="content">
              <div className="table-header-container">
                <CustomersForm />
                <div>
                  <Mutation mutation={removeCustomers} update={updateCacheRemoveCustomers}>
                    {(removeCustomers, { loading }) => (
                      <Popconfirm
                        title="Вы уверены?"
                        okText="Да"
                        cancelText="Нет"
                        placement="bottom"
                        onConfirm={async () => {
                          try {
                            await removeCustomers({
                              variables: { ids: selectedRowKeys },
                            });
                            this.setState({
                              selectedRowKeys: [],
                            });
                            message.success('Удалено');
                          } catch (e) {
                            message.error('Возникли сложности');
                            console.log(e);
                          }
                        }}>
                        <Button type="primary" hidden={!hasSelected} loading={loading}>
                          Удалить
                        </Button>
                      </Popconfirm>
                    )}
                  </Mutation>
                  <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Выбрано ${selectedRowKeys.length}` : ''}
                  </span>
                </div>
              </div>

              <Table
                className="customer-table"
                pagination={
                  data.customers.length > TABLE_ROW_COUNT ? { pageSize: TABLE_ROW_COUNT } : false
                }
                rowKey={customer => customer.id}
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={data.customers}
              />
            </Content>
          );
        }}
      </Query>
    );
  }
}

export default Customers;

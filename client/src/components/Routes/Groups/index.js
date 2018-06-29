import React, { Component } from 'react';
import {
  Button, Layout, message, Popconfirm, Table,
} from 'antd';
import { Mutation, Query } from 'react-apollo';
import Loading from '../../Loading';
import { updateGroup, getGroups, removeGroups } from '../../../apollo/gql/groups';
import GroupsForm from '../../Forms/GroupsForm';
import EditableCell from '../../EditableCell';
import nameSorter from '../../../utils/nameSorter';
import { TABLE_ROW_COUNT } from '../../../constants';
import './style.css';

const { Content } = Layout;

const updateCacheRemoveGroups = (cache, { data: { removeGroups } }) => {
  const { groups } = cache.readQuery({ query: getGroups });
  cache.writeQuery({
    query: getGroups,
    data: {
      groups: groups.filter(group => removeGroups.indexOf(group.id) === -1),
    },
  });
};

class Groups extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Группа',
        dataIndex: 'name',
        key: 'name',
        sorter: nameSorter('name'),
        render: (text, record) => (
          <Mutation mutation={updateGroup}>
            {(updateGroup, { loading }) => (
              <EditableCell
                loading={loading}
                value={text}
                onChange={async (name) => {
                  try {
                    await updateGroup({
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
      <Query query={getGroups}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return `Error! ${error.message}`;
          return (
            <Content className="content">
              <div className="table-header-container">
                <GroupsForm />
                <div>
                  <Mutation mutation={removeGroups} update={updateCacheRemoveGroups}>
                    {(removeGroups, { loading }) => (
                      <Popconfirm
                        title="Вы уверены?"
                        okText="Да"
                        cancelText="Нет"
                        placement="bottom"
                        onConfirm={async () => {
                          try {
                            await removeGroups({
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
                className="group-table"
                pagination={
                  data.groups.length > TABLE_ROW_COUNT ? { pageSize: TABLE_ROW_COUNT } : false
                }
                rowKey={group => group.id}
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={data.groups}
              />
            </Content>
          );
        }}
      </Query>
    );
  }
}

export default Groups;

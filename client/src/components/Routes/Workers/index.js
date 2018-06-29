import React, { Component } from 'react';
import {
  Button, Layout, Table, message, Popconfirm,
} from 'antd';
import { Mutation, Query } from 'react-apollo';
import Loading from '../../Loading';
import { getWorkers, removeWorkers, updateWorker } from '../../../apollo/gql/workers';
import WorkersForm from '../../Forms/WorkersForm';
import nameSorter from '../../../utils/nameSorter';
import { EditableCell, EditableFormRow, EditableContext } from '../../EditableFormRows';
import formHasErrors from '../../../utils/formHasErrors';
import { TABLE_ROW_COUNT } from '../../../constants';
import './style.css';

const { Content } = Layout;

const updateCacheRemoveWorkers = (cache, { data: { removeWorkers } }) => {
  const { workers } = cache.readQuery({ query: getWorkers });
  cache.writeQuery({
    query: getWorkers,
    data: {
      workers: workers.filter(worker => removeWorkers.indexOf(worker.id) === -1),
    },
  });
};

class Workers extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Код',
        dataIndex: 'code',
        key: 'code',
        width: '15%',
        type: 'number',
        editable: true,
        sorter: (a, b) => a.code - b.code,
      },
      {
        title: 'Имя',
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        editable: true,
        sorter: nameSorter('name'),
      },
      {
        title: 'Фамилия',
        dataIndex: 'surname',
        key: 'surname',
        width: '25%',
        editable: true,
        sorter: nameSorter('surname'),
      },
      {
        title: '',
        key: 'action',
        width: '25%',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {({ getFieldsValue, getFieldsError }) => (
                      <Mutation mutation={updateWorker}>
                        {(updateWorker, { loading }) => (
                          <Button
                            loading={loading}
                            type="primary"
                            disabled={formHasErrors(getFieldsError())}
                            onClick={async () => {
                              const { code, name, surname } = getFieldsValue();
                              try {
                                await updateWorker({
                                  variables: {
                                    id: record.id,
                                    input: {
                                      code: parseInt(code, 10),
                                      name,
                                      surname,
                                    },
                                  },
                                });
                                this.setState({ editingKey: '' });
                                message.success('Обновлено');
                              } catch (e) {
                                if (e.message === 'GraphQL error: Validation error') {
                                  message.error('Код уже занят!');
                                } else {
                                  message.error('Возникли сложности');
                                }
                              }
                            }}>
                            Сохранить
                          </Button>
                        )}
                      </Mutation>
                    )}
                  </EditableContext.Consumer>
                </span>
              ) : (
                <Button type="primary" onClick={() => this.edit(record.id)}>
                  Изменить
                </Button>
              )}
            </div>
          );
        },
      },
    ];
  }

  state = {
    selectedRowKeys: [],
    editingKey: '',
  };

  isEditing = record => record.id === this.state.editingKey;

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  edit = (id) => {
    this.setState({ editingKey: id });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          type: col.type,
          record,
          dataIndex: col.dataIndex,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Query query={getWorkers}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return `Error! ${error.message}`;
          return (
            <Content className="content">
              <div className="table-header-container">
                <WorkersForm />
                <div>
                  <Mutation mutation={removeWorkers} update={updateCacheRemoveWorkers}>
                    {(removeWorkers, { loading }) => (
                      <Popconfirm
                        title="Вы уверены?"
                        okText="Да"
                        cancelText="Нет"
                        placement="bottom"
                        onConfirm={async () => {
                          try {
                            await removeWorkers({
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
                className="worker-table"
                pagination={
                  data.workers.length > TABLE_ROW_COUNT ? { pageSize: TABLE_ROW_COUNT } : false
                }
                components={components}
                rowSelection={rowSelection}
                rowKey={worker => worker.id}
                columns={columns}
                dataSource={data.workers}
              />
            </Content>
          );
        }}
      </Query>
    );
  }
}

export default Workers;

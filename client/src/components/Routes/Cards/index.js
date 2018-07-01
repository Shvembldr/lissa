import React, { Component } from 'react';
import {
  Button, Table, Layout, Popconfirm, message, Input, Icon,
} from 'antd';
import { Mutation, Query, withApollo } from 'react-apollo';
import { getCards, removeCards, updateCard } from '../../../apollo/gql/cards';
import CardsForm from '../../Forms/CardsForm';
import OperationForm from '../../Forms/OperationMinutesForm';
import { getGroups } from '../../../apollo/gql/groups';
import { EditableCell, EditableFormRow, EditableContext } from '../../EditableFormRows';
import formHasErrors from '../../../utils/formHasErrors';
import { TABLE_ROW_COUNT } from '../../../constants';
import './style.css';

const { Content } = Layout;

class Cards extends Component {
  state = {
    selectedRowKeys: [],
    editingKey: '',
    loading: false,
    queryVariables: {
      limit: TABLE_ROW_COUNT,
      offset: 0,
      match: '',
    },
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
  };

  onTableChange = (pagination, filters) => {
    this.setState({
      queryVariables: {
        ...this.state.queryVariables,
        limit: pagination.pageSize,
        offset: pagination.pageSize * (pagination.current - 1),
        filters: filters.group,
      },
    });
  };

  onSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  onSearch = () => {
    const { searchText } = this.state;
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      queryVariables: {
        ...this.state.queryVariables,
        match: searchText,
      },
    });
  };

  cancelSearch = () => {
    this.setState({
      filterDropdownVisible: false,
      filtered: false,
      searchText: '',
      queryVariables: {
        ...this.state.queryVariables,
        match: '',
      },
    });
  };

  getFilters = () => {
    const { groups } = this.props.client.cache.readQuery({ query: getGroups });
    return groups.map(group => ({
      text: group.name,
      value: group.id,
    }));
  };

  isEditing = record => record.id === this.state.editingKey;

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  edit = (id) => {
    this.setState({ editingKey: id });
  };

  render() {
    const cols = [
      {
        title: 'Артикул',
        dataIndex: 'vendorCode',
        key: 'vendorCode',
        editable: true,
        width: '25%',
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              // eslint-disable-next-line no-return-assign
              ref={ele => (this.searchInput = ele)}
              placeholder="Артикул"
              value={this.state.searchText}
              onChange={this.onSearchChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              Поиск
            </Button>
          </div>
        ),
        filterIcon: this.state.filtered ? (
          <Icon type="close" onClick={this.cancelSearch} style={{ color: 'red' }} />
        ) : (
          <Icon type="search" />
        ),
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState(
            {
              filterDropdownVisible: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          );
        },
      },
      {
        title: 'Группа',
        dataIndex: 'group',
        key: 'group',
        editable: true,
        width: '25%',
        filters: this.getFilters(),
        type: 'groupSelect',
        render: group => (group ? group.name : ''),
      },
      {
        title: 'Операции',
        dataIndex: 'operations',
        key: 'operations',
        width: '25%',
        render: operations => <div>{operations.length}</div>,
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
                      <Mutation mutation={updateCard}>
                        {(updateCard, { loading }) => (
                          <Button
                            loading={loading}
                            type="primary"
                            disabled={formHasErrors(getFieldsError())}
                            onClick={async () => {
                              const { vendorCode, group } = getFieldsValue();
                              try {
                                await updateCard({
                                  variables: {
                                    id: record.id,
                                    input: { vendorCode, groupId: group },
                                  },
                                });
                                this.setState({ editingKey: '' });
                                message.success('Обновлено');
                              } catch (e) {
                                message.error('Возникли сложности');
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

    const columns = cols.map((col) => {
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
      <Query query={getCards} variables={this.state.queryVariables}>
        {({
          loading, error, data: { cards }, refetch,
        }) => {
          if (error) return `Error! ${error.message}`;
          return (
            <Content className="content">
              <div className="table-header-container">
                <CardsForm refetch={refetch} />
                <div>
                  <Mutation mutation={removeCards} update={() => refetch()}>
                    {(removeCards, { loading }) => (
                      <Popconfirm
                        title="Вы уверены?"
                        okText="Да"
                        cancelText="Нет"
                        placement="bottom"
                        onConfirm={async () => {
                          try {
                            await removeCards({
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
                className="cards-table"
                rowKey={card => card.id}
                loading={loading}
                pagination={
                  cards && cards.count > TABLE_ROW_COUNT
                    ? { pageSize: TABLE_ROW_COUNT, total: cards.count }
                    : false
                }
                components={components}
                columns={columns}
                dataSource={cards && cards.rows}
                rowSelection={rowSelection}
                onChange={this.onTableChange}
                scroll={{ y: '70vh' }}
                expandedRowRender={record => (
                  <div>
                    <h3>Операции (минуты)</h3>
                    {<OperationForm operations={record.operations} />}
                  </div>
                )}
              />
            </Content>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(Cards);

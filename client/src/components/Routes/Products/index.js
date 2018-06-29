import React, { Component } from 'react';
import {
  Button, Layout, Popconfirm, message, Input, DatePicker, Table, Icon,
} from 'antd';
import { Mutation, Query, withApollo } from 'react-apollo';
import moment from 'moment';
import ProductForm from '../../Forms/ProductForm';
import OperationForm from '../../Forms/OperationWorkerForm';
import { getGroups } from '../../../apollo/gql/groups';
import { getProducts, removeProducts, updateProduct } from '../../../apollo/gql/product';
import { EditableCell, EditableFormRow, EditableContext } from '../../EditableFormRows';
import { DATE_FORMAT, TABLE_ROW_COUNT } from '../../../constants';
import formHasErrors from '../../../utils/formHasErrors';
import './style.css';

const { Content } = Layout;
const { RangePicker } = DatePicker;

class Products extends Component {
  state = {
    selectedRowKeys: [],
    editingKey: '',
    queryVariables: {
      limit: TABLE_ROW_COUNT,
      offset: 0,
      match: '',
      filter: '',
      dates: null,
    },
    filterArticleDropdownVisible: false,
    filteredArticle: false,
    searchText: '',
    filterDateDropdownVisible: false,
    filteredDate: false,
    searchDateRange: [],
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

  onSearchDateChange = (value) => {
    this.setState({ searchDateRange: value });
  };

  onSearch = () => {
    const { searchText, queryVariables } = this.state;
    this.setState({
      filterArticleDropdownVisible: false,
      filteredArticle: !!searchText,
      queryVariables: {
        ...queryVariables,
        limit: TABLE_ROW_COUNT,
        offset: 0,
        match: searchText,
      },
    });
  };

  onSearchDate = () => {
    const { searchDateRange, queryVariables } = this.state;
    const dates = searchDateRange.map(date => date.toISOString());
    this.setState({
      filterDateDropdownVisible: false,
      filteredDate: true,
      queryVariables: {
        ...queryVariables,
        limit: TABLE_ROW_COUNT,
        offset: 0,
        dates,
      },
    });
  };

  onCancelAricleSearch = () => {
    this.setState({
      filterArticleDropdownVisible: false,
      filteredArticle: false,
      searchText: '',
      queryVariables: {
        ...this.state.queryVariables,
        limit: TABLE_ROW_COUNT,
        offset: 0,
        match: '',
      },
    });
  };

  onCancelDateSearch = () => {
    this.setState({
      filterDateDropdownVisible: false,
      filteredDate: false,
      searchDateRange: [],
      queryVariables: {
        ...this.state.queryVariables,
        limit: TABLE_ROW_COUNT,
        offset: 0,
        dates: null,
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
        type: 'cardSelect',
        width: '10%',
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
        filterIcon: this.state.filteredArticle ? (
          <Icon type="close" onClick={this.onCancelAricleSearch} style={{ color: 'red' }} />
        ) : (
          <Icon type="search" />
        ),
        filterDropdownVisible: this.state.filterArticleDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState(
            {
              filterArticleDropdownVisible: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          );
        },
      },
      {
        title: 'Заказчик',
        type: 'customerSelect',
        width: '15%',
        dataIndex: 'customer',
        key: 'customer',
        editable: true,
        render: group => (group ? group.name : ''),
      },
      {
        title: 'Группа',
        dataIndex: 'group',
        width: '18%',
        key: 'group',
        filters: this.getFilters(),
        render: group => (group ? group.name : ''),
      },
      {
        title: 'Размер',
        dataIndex: 'size',
        width: '12%',
        key: 'size',
        editable: true,
        type: 'sizeSelect',
      },
      {
        title: 'Количество',
        dataIndex: 'count',
        width: '12%',
        key: 'count',
        editable: true,
        type: 'number',
      },
      {
        title: 'Дата',
        dataIndex: 'date',
        width: '15%',
        key: 'date',
        editable: true,
        type: 'datePicker',
        render: date => moment(new Date(date)).format('DD.MM.YYYY'),
        filterDropdown: (
          <div className="custom-filter-dropdown-date">
            <RangePicker
              // eslint-disable-next-line no-return-assign
              ref={ele => (this.searchInput = ele)}
              format={DATE_FORMAT}
              onChange={this.onSearchDateChange}
              onPressEnter={this.onSearchDate}
              getCalendarContainer={() => document.querySelector('.custom-filter-dropdown-date')}
            />
            <Button
              className="custom-filter-dropdown-date__button"
              type="primary"
              onClick={this.onSearchDate}>
              Поиск
            </Button>
          </div>
        ),
        filterIcon: this.state.filteredDate ? (
          <Icon type="close" onClick={this.onCancelDateSearch} style={{ color: 'red' }} />
        ) : (
          <Icon type="search" />
        ),
        filterDropdownVisible: this.state.filterDateDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState(
            {
              filterDateDropdownVisible: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          );
        },
      },
      {
        title: 'Операции',
        dataIndex: 'operations',
        width: '8%',
        key: 'operations',
        render: operations => operations.length,
      },
      {
        title: '',
        key: 'action',
        width: '10%',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {({ getFieldsValue, getFieldsError }) => (
                      <Mutation mutation={updateProduct}>
                        {(updateProduct, { loading }) => (
                          <Button
                            loading={loading}
                            type="primary"
                            disabled={formHasErrors(getFieldsError())}
                            onClick={async () => {
                              const {
                                vendorCode, size, customer, count, date,
                              } = getFieldsValue();
                              try {
                                await updateProduct({
                                  variables: {
                                    id: record.id,
                                    input: {
                                      vendorCode,
                                      customerId: customer,
                                      size,
                                      count,
                                      date,
                                    },
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
      <Query query={getProducts} variables={this.state.queryVariables}>
        {({
          loading, error, data: { products }, refetch,
        }) => {
          if (error) return `Error! ${error.message}`;
          return (
            <Content className="content">
              <div className="table-header-container">
                <ProductForm refetch={refetch} />
                <div>
                  <Mutation mutation={removeProducts} update={() => refetch()}>
                    {(removeProducts, { loading }) => (
                      <Popconfirm
                        title="Вы уверены?"
                        okText="Да"
                        cancelText="Нет"
                        placement="bottom"
                        onConfirm={async () => {
                          try {
                            await removeProducts({
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
                className="production-table"
                loading={loading}
                pagination={
                  products && products.count > TABLE_ROW_COUNT
                    ? { pageSize: TABLE_ROW_COUNT, total: products.count }
                    : false
                }
                rowKey={product => product.id}
                components={components}
                columns={columns}
                dataSource={products && products.rows}
                rowSelection={rowSelection}
                scroll={{ y: '70vh' }}
                onChange={this.onTableChange}
                expandedRowRender={record => (
                  <div>
                    <h3>Операции (сотрудники)</h3>
                    <OperationForm operations={record.operations} />
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

export default withApollo(Products);

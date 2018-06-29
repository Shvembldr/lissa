import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Select } from 'antd';
import { getGroups } from '../../apollo/gql/groups';

// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;

class GroupSelect extends Component {
  render() {
    const { value, ...restProps } = this.props;
    return (
      <Query query={getGroups}>
        {({ loading, error, data }) => {
          if (loading) return <Select placeholder="загрузка..." style={{ width: 150 }} />;
          if (error) return `Error! ${error.message}`;
          return (
            <Select
              defaultValue={value}
              value={value}
              placeholder="Группа"
              style={{ width: 150 }}
              {...restProps}>
              {data.groups.map(group => (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              ))}
            </Select>
          );
        }}
      </Query>
    );
  }
}

export default GroupSelect;

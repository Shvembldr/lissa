import React, { Component } from 'react';
import { Select } from 'antd';

// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;

class WorkerSelect extends Component {
  render() {
    const { value, workers, ...restProps } = this.props;
    return (
      <Select
        showSearch
        notFoundContent="Не найден"
        filterOption={false}
        defaultValue={value}
        placeholder="Сотрудник"
        style={{ width: 150 }}
        {...restProps}>
        {workers.map(worker => (
          <Option key={worker.id} value={worker.code}>
            {worker.code}
          </Option>
        ))}
      </Select>
    );
  }
}

export default WorkerSelect;

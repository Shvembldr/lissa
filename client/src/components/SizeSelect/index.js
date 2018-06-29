import React, { Component } from 'react';
import { Select } from 'antd';

// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;

class SizeSelect extends Component {
  render() {
    const { value, ...restProps } = this.props;
    return (
      <Select value={value} placeholder="Размер" style={{ width: 100 }} {...restProps}>
        <Option key={1} value={34}>
          34
        </Option>
        <Option key={2} value={36}>
          36
        </Option>
        <Option key={3} value={38}>
          38
        </Option>
        <Option key={4} value={40}>
          40
        </Option>
        <Option key={5} value={42}>
          42
        </Option>
        <Option key={6} value={44}>
          44
        </Option>
        <Option key={7} value={46}>
          46
        </Option>
        <Option key={8} value={48}>
          48
        </Option>
        <Option key={9} value={50}>
          50
        </Option>
        <Option key={10} value={52}>
          52
        </Option>
        <Option key={11} value={54}>
          54
        </Option>
        <Option key={12} value={56}>
          56
        </Option>
        <Option key={13} value={58}>
          58
        </Option>
      </Select>
    );
  }
}

export default SizeSelect;

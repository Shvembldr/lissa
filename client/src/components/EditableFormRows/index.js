import React from 'react';
import PropTypes from 'prop-types';
import {
  DatePicker, Form, Input, InputNumber,
} from 'antd';
import moment from 'moment/moment';
import GroupSelect from '../GroupSelect';
import CardSelect from '../CardSelect';
import { DATE_FORMAT } from '../../constants';
import CustomerSelect from '../CustomerSelect';
import SizeSelect from '../SizeSelect';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    editing: PropTypes.bool,
    dataIndex: PropTypes.string,
  };

  getInput = () => {
    switch (this.props.type) {
      case 'groupSelect':
        return <GroupSelect />;
      case 'cardSelect':
        return <CardSelect />;
      case 'customerSelect':
        return <CustomerSelect />;
      case 'datePicker':
        return <DatePicker format={DATE_FORMAT} />;
      case 'sizeSelect':
        return <SizeSelect />;
      case 'number':
        return <InputNumber />;
      default:
        return <Input />;
    }
  };

  getRulesAndValue = () => {
    switch (this.props.type) {
      case 'groupSelect':
        return {
          rules: [
            {
              required: true,
              type: 'number',
            },
          ],
          initialValue: this.props.record.group.id,
        };
      case 'customerSelect':
        return {
          rules: [
            {
              required: true,
              type: 'number',
            },
          ],
          initialValue: this.props.record.customer.id,
        };
      case 'datePicker':
        return {
          rules: [
            {
              required: true,
            },
          ],
          initialValue: moment(new Date(this.props.record.date)),
        };
      case 'number':
        return {
          rules: [
            {
              required: true,
              pattern: /^\d+$/,
            },
          ],
          initialValue: this.props.record[this.props.dataIndex],
        };
      default:
        return {
          rules: [
            {
              required: true,
            },
          ],
          initialValue: this.props.record[this.props.dataIndex],
        };
    }
  };

  render() {
    const { editing, dataIndex, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }} help={''}>
                  {getFieldDecorator(dataIndex, this.getRulesAndValue())(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export { EditableContext, EditableFormRow, EditableCell };

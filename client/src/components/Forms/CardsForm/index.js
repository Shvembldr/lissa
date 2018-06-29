import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Input, Button, message, InputNumber,
} from 'antd';
import { Mutation } from 'react-apollo';
import { createCard } from '../../../apollo/gql/cards';
import GroupSelect from '../../GroupSelect';
import formHasErrors from '../../../utils/formHasErrors';
import './style.css';

const FormItem = Form.Item;

class CardsForm extends React.Component {
  static propTypes = {
    refetch: PropTypes.func,
  };

  componentDidMount() {
    this.props.form.validateFields();
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const vendorCodeError = isFieldTouched('vendorCode') && getFieldError('vendorCode');
    const groupError = isFieldTouched('group') && getFieldError('group');
    const operationsError = isFieldTouched('operations') && getFieldError('operations');
    return (
      <Mutation mutation={createCard} update={this.props.refetch}>
        {(createCard, { loading }) => (
          <Form
            layout="inline"
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields(async (err, { vendorCode, group, operations }) => {
                if (!err) {
                  try {
                    await createCard({
                      variables: {
                        input: { vendorCode, groupId: group },
                        operationCount: operations,
                      },
                    });
                    message.success('Изделие добавлено');
                    this.props.form.resetFields();
                    this.props.form.setFieldsValue({
                      group: '',
                    });
                  } catch (e) {
                    if (e.message === 'GraphQL error: Validation error') {
                      message.error('Изделие уже существует');
                    } else {
                      message.error('Возникли сложности');
                    }
                    console.log(e);
                  }
                }
              });
            }}>
            <FormItem validateStatus={vendorCodeError ? 'error' : ''} help={''}>
              {getFieldDecorator('vendorCode', {
                rules: [{ required: true, max: 16 }],
              })(<Input placeholder="Артикул" />)}
            </FormItem>
            <FormItem validateStatus={groupError ? 'error' : ''} help={''}>
              {getFieldDecorator('group', {
                rules: [{ required: true }],
              })(<GroupSelect />)}
            </FormItem>
            <FormItem validateStatus={operationsError ? 'error' : ''} help={''}>
              {getFieldDecorator('operations', {
                rules: [{ required: true }],
              })(<InputNumber style={{ width: 180 }} min={1} placeholder="Количество операций" />)}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={formHasErrors(getFieldsError())}>
                Добавить изделие
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

const WrappedCardsForm = Form.create()(CardsForm);

export default WrappedCardsForm;

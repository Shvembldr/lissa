import React from 'react';
import {
  Form, Input, Button, message,
} from 'antd';
import { Mutation } from 'react-apollo';
import { createCustomer, getCustomers } from '../../../apollo/gql/customers';
import formHasErrors from '../../../utils/formHasErrors';

const FormItem = Form.Item;

const updateCache = (cache, { data: { createCustomer } }) => {
  const { customers } = cache.readQuery({ query: getCustomers });
  cache.writeQuery({
    query: getCustomers,
    data: { customers: [createCustomer, ...customers] },
  });
};

class CustomersForm extends React.Component {
  componentDidMount() {
    this.props.form.validateFields();
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const nameError = isFieldTouched('name') && getFieldError('name');
    return (
      <Mutation mutation={createCustomer} update={updateCache}>
        {(createCustomer, { loading }) => (
          <Form
            layout="inline"
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields(async (err, values) => {
                if (!err) {
                  try {
                    await createCustomer({
                      variables: { input: { name: values.name } },
                    });
                    message.success('Заказчик добавлен');
                    this.props.form.resetFields();
                  } catch (e) {
                    message.error('Возникли сложности');
                    console.log(e);
                  }
                }
              });
            }}>
            <FormItem validateStatus={nameError ? 'error' : ''} help={''}>
              {getFieldDecorator('name', {
                rules: [{ required: true, max: 24 }],
              })(<Input placeholder="Название" />)}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={formHasErrors(getFieldsError())}>
                Добавить заказчика
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

const WrappedCustomersForm = Form.create()(CustomersForm);

export default WrappedCustomersForm;

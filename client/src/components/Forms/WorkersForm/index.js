import React from 'react';
import {
  Form, Input, Button, message,
} from 'antd';
import { Mutation } from 'react-apollo';
import { createWorker, getWorkers } from '../../../apollo/gql/workers';
import formHasErrors from '../../../utils/formHasErrors';

const FormItem = Form.Item;

const updateCache = (cache, { data: { createWorker } }) => {
  const { workers } = cache.readQuery({ query: getWorkers });
  cache.writeQuery({
    query: getWorkers,
    data: { workers: workers.concat([createWorker]) },
  });
};

class WorkersForm extends React.Component {
  componentDidMount() {
    this.props.form.validateFields();
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const codeError = isFieldTouched('code') && getFieldError('code');
    const nameError = isFieldTouched('name') && getFieldError('name');
    const surnameError = isFieldTouched('surname') && getFieldError('surname');
    return (
      <Mutation mutation={createWorker} update={updateCache}>
        {(createWorker, { loading }) => (
          <Form
            layout="inline"
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields(async (err, { code, name, surname }) => {
                if (!err) {
                  try {
                    await createWorker({
                      variables: { input: { code, name, surname } },
                    });
                    message.success('Сотрудник добавлен');
                    this.props.form.resetFields();
                  } catch (e) {
                    if (e.message === 'GraphQL error: Validation error') {
                      message.error('Код уже занят!');
                    } else {
                      message.error('Возникли сложности');
                    }
                  }
                }
              });
            }}>
            <FormItem validateStatus={codeError ? 'error' : ''} help={''}>
              {getFieldDecorator('code', {
                rules: [{ required: true, pattern: /^\d+$/ }],
              })(<Input placeholder="Код" />)}
            </FormItem>
            <FormItem validateStatus={nameError ? 'error' : ''} help={''}>
              {getFieldDecorator('name', {
                rules: [{ required: true, max: 20 }],
              })(<Input placeholder="Имя" />)}
            </FormItem>
            <FormItem validateStatus={surnameError ? 'error' : ''} help={''}>
              {getFieldDecorator('surname', {
                rules: [{ required: true, max: 20 }],
              })(<Input placeholder="Фамилия" />)}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={formHasErrors(getFieldsError())}>
                Добавить сотрудника
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

const WrappedWorkersForm = Form.create()(WorkersForm);

export default WrappedWorkersForm;

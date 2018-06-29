import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, message, InputNumber,
} from 'antd';
import { Mutation } from 'react-apollo';
import { updateOperations } from '../../../apollo/gql/operations';
import formHasErrors from '../../../utils/formHasErrors';
import './style.css';

const FormItem = Form.Item;

class OperationForm extends React.Component {
  static propTypes = {
    operations: PropTypes.arrayOf(PropTypes.object),
  };

  getError = id => this.props.form.isFieldTouched(`${id}` && this.props.form.getFieldError(`${id}`));

  render() {
    const { operations } = this.props;
    const { getFieldDecorator, getFieldsError } = this.props.form;
    return (
      <Mutation mutation={updateOperations}>
        {(updateOperations, { loading }) => (
          <Form
            layout="inline"
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields(async (err, values) => {
                if (!err) {
                  const input = Object.keys(values).map(key => ({
                    id: parseInt(key, 10),
                    workerCode: values[key],
                  }));
                  try {
                    await updateOperations({
                      variables: {
                        input,
                      },
                    });
                    message.success('Сохранено');
                    this.props.form.resetFields();
                  } catch (e) {
                    if (e.message === 'GraphQL error: Wrong worker id') {
                      message.error('Сотрудник не существует');
                    } else {
                      message.error('Возникли сложности');
                    }
                    console.log(e);
                  }
                }
              });
            }}>
            {operations.map(({ id, code, worker }) => (
              <div key={id}>
                <FormItem
                  label={`${code}`}
                  validateStatus={this.getError(id) ? 'error' : ''}
                  help={''}>
                  {getFieldDecorator(`${id}`, {
                    rules: [{ pattern: /^\d+$/ }],
                    initialValue: worker && worker.code,
                  })(<InputNumber style={{ width: 150 }} placeholder="Сотрудник" />)}
                </FormItem>
                <FormItem>
                  <div>{worker && `Сотрудник: ${worker.name} ${worker.surname}`}</div>
                </FormItem>
              </div>
            ))}

            <FormItem className="operation-worker-form-button">
              <Button
                tabIndex="0"
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={formHasErrors(getFieldsError())}>
                Сохранить
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

const WrappedOperationForm = Form.create()(OperationForm);

export default WrappedOperationForm;

import React from 'react';
import {
  Form, InputNumber, Button, message,
} from 'antd';
import { Mutation } from 'react-apollo';
import { updateOperations } from '../../../apollo/gql/operations';
import declOfNum from '../../../utils/declOfNum';
import priceConverter from '../../../utils/priceConverter';
import formHasErrors from '../../../utils/formHasErrors';
import './style.css';

const FormItem = Form.Item;

class OperationForm extends React.Component {
  getError = id => this.props.form.isFieldTouched(`${id}` && this.props.form.getFieldError(`${id}`));

  render() {
    const { operations } = this.props;
    const { getFieldDecorator, getFieldsError } = this.props.form;
    return (
      <Mutation mutation={updateOperations}>
        {(updateOperations, { loading }) => (
          <Form
            layout="inline"
            hideRequiredMark={true}
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields(async (err, values) => {
                if (!err) {
                  const input = Object.keys(values).map(key => ({
                    id: parseInt(key, 10),
                    price: priceConverter.fromDecimals(values[key]),
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
                    message.error('Возникли сложности');
                    console.log(e);
                  }
                }
              });
            }}>
            {operations.map(({ id, code, price }) => {
              const convertedPrice = priceConverter.toDecimals(price);
              return (
                <div key={id}>
                  <FormItem
                    label={`${code}`}
                    validateStatus={this.getError(id) ? 'error' : ''}
                    help={''}
                    colon={false}>
                    {getFieldDecorator(`${id}`, {
                      rules: [{ required: true, pattern: /^(?!0$)\d+(?:[,.]\d)?$/ }],
                      initialValue: convertedPrice,
                    })(<InputNumber placeholder={convertedPrice} step={0.1} min={0} />)}
                  </FormItem>
                  <FormItem>
                    <div>{`${convertedPrice} ${declOfNum(convertedPrice, [
                      'минута',
                      'минуты',
                      'минут',
                    ])}`}</div>
                  </FormItem>
                </div>
              );
            })}

            <FormItem className="operation-form-button">
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

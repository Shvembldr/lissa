import React from 'react';
import {
  Form, Button, message, InputNumber, DatePicker,
} from 'antd';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import SizeSelect from '../../SizeSelect/index';
import { createProduct } from '../../../apollo/gql/product';
import CardSelect from '../../CardSelect/index';
import CustomerSelect from '../../CustomerSelect/index';
import { DATE_FORMAT } from '../../../constants';
import formHasErrors from '../../../utils/formHasErrors';

const FormItem = Form.Item;
const now = new Date();
const defaultDate = moment(now, DATE_FORMAT);

class ProductForm extends React.Component {
  componentDidMount() {
    this.props.form.validateFields();
  }

  state = {
    cardsValue: '',
  };

  setCardField = (value) => {
    this.setState({
      cardsValue: value,
    });
  };

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const cardError = isFieldTouched('card') && getFieldError('card');
    const customerError = isFieldTouched('customer') && getFieldError('customer');
    const sizeError = isFieldTouched('size') && getFieldError('size');
    const dateError = isFieldTouched('date') && getFieldError('date');
    const countError = isFieldTouched('count') && getFieldError('count');
    return (
      <Mutation mutation={createProduct} update={this.props.refetch}>
        {(createProduct, { loading }) => (
          <Form
            layout="inline"
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields(
                async (err, {
                  vendorCode, customer, size, count, date,
                }) => {
                  if (!err) {
                    try {
                      await createProduct({
                        variables: {
                          input: {
                            vendorCode,
                            customerId: customer,
                            size,
                            count,
                            date: date.endOf('day').toISOString(),
                          },
                        },
                      });
                      message.success('Продукт добавлен');
                      this.setState({
                        cardsValue: '',
                      });
                      this.props.form.resetFields();
                      this.props.form.validateFields();
                    } catch (e) {
                      message.error('Возникли сложности');
                      console.log(e);
                    }
                  }
                },
              );
            }}>
            <FormItem validateStatus={cardError ? 'error' : ''} help={''}>
              {getFieldDecorator('vendorCode', {
                rules: [{ required: true }],
              })(<CardSelect stateValue={this.state.cardsValue} setField={this.setCardField} />)}
            </FormItem>
            <FormItem validateStatus={customerError ? 'error' : ''} help={''}>
              {getFieldDecorator('customer', {
                rules: [{ required: true }],
              })(<CustomerSelect />)}
            </FormItem>
            <FormItem validateStatus={sizeError ? 'error' : ''} help={''}>
              {getFieldDecorator('size')(<SizeSelect />)}
            </FormItem>
            <FormItem validateStatus={countError ? 'error' : ''} help={''}>
              {getFieldDecorator('count', {
                rules: [{ required: true }],
              })(<InputNumber style={{ width: 180 }} min={1} placeholder="Количество" />)}
            </FormItem>
            <FormItem validateStatus={dateError ? 'error' : ''} help={''}>
              {getFieldDecorator('date', {
                rules: [{ required: true }],
                initialValue: defaultDate,
              })(<DatePicker format={DATE_FORMAT} />)}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={formHasErrors(getFieldsError())}>
                Добавить продукцию
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

const WrappedProductForm = Form.create()(ProductForm);

export default WrappedProductForm;

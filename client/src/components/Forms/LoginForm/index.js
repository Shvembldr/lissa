import React from 'react';
import {
  Form, Icon, Input, Button,
} from 'antd';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import login from '../../../apollo/gql/login';
import './style.css';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Mutation mutation={login}>
        {(login, { loading, error }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields(async (err, { email, password }) => {
                if (!err) {
                  try {
                    const {
                      data: {
                        login: { token, refreshToken },
                      },
                    } = await login({
                      variables: { input: { email, password } },
                    });
                    localStorage.setItem('x-token', token);
                    localStorage.setItem('x-refresh-token', refreshToken);
                    this.props.history.push('/app/cards');
                  } catch (e) {
                    console.log('Error: ', e);
                  }
                }
              });
            }}
            className="login-form">
            <FormItem validateStatus={error && 'error'}>
              {getFieldDecorator('email', {
                initialValue: 'admin@admin.com',
                rules: [{ type: 'email', required: true, message: 'Введите email' }],
              })(
                <Input
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                />,
              )}
            </FormItem>
            <FormItem validateStatus={error && 'error'} help={error && 'неверные данные'}>
              {getFieldDecorator('password', {
                initialValue: 'admin',
                rules: [{ required: true, message: 'Введите пароль' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Пароль"
                />,
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}>
                Войти
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

const LoginForm = Form.create()(NormalLoginForm);

export default withRouter(LoginForm);

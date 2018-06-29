import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import LoginForm from '../Forms/LoginForm';

const Login = () => (
  <Fragment>
    <Row>
      <Col xs={2} sm={4} md={6} lg={8} xl={10} />
      <Col xs={20} sm={16} md={12} lg={8} xl={4}>
        {<LoginForm />}
      </Col>
      <Col xs={2} sm={4} md={6} lg={8} xl={10} />
    </Row>
  </Fragment>
);

export default Login;

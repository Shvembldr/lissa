import React from 'react';
import { Spin } from 'antd';
import './style.css';

export default () => (
  <div className="loading-container">
    <Spin size="large" />
  </div>
);

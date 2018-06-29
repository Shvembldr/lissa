import React from 'react';
import { Button, Input } from 'antd';
import './style.css';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  };

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  };

  check = () => {
    this.setState({ editable: false });
    this.props.onChange(this.state.value);
  };

  edit = () => {
    this.setState({ editable: true });
  };

  render() {
    const { value, editable } = this.state;
    const { loading } = this.props;
    return (
      <div className="editable-cell">
        {editable ? (
          <div className="input-container">
            <Input
              value={value}
              autoFocus={true}
              onChange={this.handleChange}
              onPressEnter={this.check}
            />
            <Button
              className="ok-button"
              shape="circle"
              loading={loading}
              icon="check"
              onClick={this.check}
            />
          </div>
        ) : (
          <div style={{ paddingRight: 24 }}>
            <div className="input-container">
              {value || ' '}
              <Button shape="circle" icon="edit" onClick={this.edit} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default EditableCell;

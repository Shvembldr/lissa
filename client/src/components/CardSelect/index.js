import React, { Component } from 'react';
import { Select, message, Spin } from 'antd';
import { withApollo } from 'react-apollo/index';
import { getCardsMatch } from '../../apollo/gql/cards';
import './style.css';

// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;

class CardSelect extends Component {
  state = {
    cards: [],
    loading: false,
  };

  componentDidMount = () => {
    if (this.props.value) {
      this.setState({
        value: this.props.value,
      });
    }
  };

  handleChange = async (value) => {
    if (this.props.setField) {
      this.props.setField(value);
    } else {
      this.setState({ value });
    }

    try {
      this.setState({ loading: true });
      const {
        data: { cardsMatch },
      } = await this.props.client.query({
        query: getCardsMatch,
        variables: {
          match: value,
        },
      });
      this.setState({
        cards: cardsMatch,
        loading: false,
      });
    } catch (e) {
      console.log(e);
      message.error('Возникли сложности');
    }
  };

  render() {
    const { value, onChange, ...restProps } = this.props;
    const { cards, loading } = this.state;
    const options = cards.map(card => (
      <Option key={card.id} value={card.vendorCode.toString()}>
        {card.vendorCode}
      </Option>
    ));
    return (
      <div className="card-select-container">
        <Select
          mode="combobox"
          notFoundContent="Не найден"
          value={this.props.stateValue ? this.props.stateValue : this.state.value}
          filterOption={false}
          placeholder="Изделие"
          onChange={this.handleChange}
          style={{ width: 120 }}
          onSelect={onChange}
          {...restProps}>
          {options}
        </Select>
        {loading && <Spin size="small" className="card-select-spinner" />}
      </div>
    );
  }
}

export default withApollo(CardSelect);

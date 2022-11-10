import PropTypes from 'prop-types';
import React, { Component } from 'react';

class CartItem extends Component {
  handleIncreaseOrDecrease = (decreaseOnIncrease) => {
    const { id, update, availableQuantity } = this.props;

    const currentLocalStorage = JSON.parse(localStorage.getItem('cartItems'));

    const indexOfExistent = currentLocalStorage
      .findIndex((cartItems) => cartItems.id === id);

    const currentQuantity = currentLocalStorage[indexOfExistent].quantity;
    if (decreaseOnIncrease === 'increase'
    && currentLocalStorage[indexOfExistent].quantity < availableQuantity) {
      currentLocalStorage[indexOfExistent].quantity += 1;
    }
    if (decreaseOnIncrease === 'decrease' && currentQuantity > 1) {
      currentLocalStorage[indexOfExistent].quantity -= 1;
    }

    localStorage.setItem('cartItems', JSON.stringify(currentLocalStorage));
    update();
  };

  handleDeleteCartItem = () => {
    const { id, update } = this.props;

    const currentLocalStorage = JSON.parse(localStorage.getItem('cartItems'));
    const filteredLocalStorage = currentLocalStorage
      .filter((cartItems) => cartItems.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(filteredLocalStorage));
    update();
  };

  render() {
    const { title, quantity } = this.props;

    return (
      <div>
        <p data-testid="shopping-cart-product-name">{ title }</p>
        <p data-testid="shopping-cart-product-quantity">{ quantity }</p>
        <button
          type="button"
          data-testid="product-increase-quantity"
          onClick={ () => this.handleIncreaseOrDecrease('increase') }
        >
          +
        </button>
        <button
          type="button"
          data-testid="product-decrease-quantity"
          onClick={ () => this.handleIncreaseOrDecrease('decrease') }
        >
          -
        </button>
        <button
          type="button"
          data-testid="remove-product"
          onClick={ this.handleDeleteCartItem }
        >
          Remover
        </button>
      </div>
    );
  }
}

CartItem.propTypes = {
  title: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  availableQuantity: PropTypes.number.isRequired,
};

export default CartItem;

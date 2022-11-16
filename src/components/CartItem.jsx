import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, TextField, Select, MenuItem, IconButton } from '@mui/material';

class CartItem extends Component {
  handleIncreaseOrDecrease = (decreaseOnIncrease) => {
    const { id, update, availableQuantity, shoppingCartQuantitySum, refreshCartItems } = this.props;

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
    shoppingCartQuantitySum();
    refreshCartItems();
    update();
  };

  handleDeleteCartItem = () => {
    const { id, update, shoppingCartQuantitySum, refreshCartItems } = this.props;

    const currentLocalStorage = JSON.parse(localStorage.getItem('cartItems'));
    const filteredLocalStorage = currentLocalStorage
      .filter((cartItems) => cartItems.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(filteredLocalStorage));
    shoppingCartQuantitySum();
    refreshCartItems();
    update();
  };

  render() {
    const { title, quantity } = this.props;

    return (
      <div className="cartitem-content">
        <p data-testid="shopping-cart-product-name">{ title }</p>
        <p data-testid="shopping-cart-product-quantity">
          Quantidade: { quantity }
        </p>
        <div className="cartitem-btn-plusless">
          <Button
            type="button"
            size="small"
            variant="contained"
            data-testid="product-increase-quantity"
            onClick={ () => this.handleIncreaseOrDecrease('increase') }
          >
            +
          </Button>
          <Button
            type="button"
            size="small"
            variant="contained"
            data-testid="product-decrease-quantity"
            onClick={ () => this.handleIncreaseOrDecrease('decrease') }
          >
            -
          </Button>
        </div>
        <div>
          <Button
            type="button"
            size="small"
            variant="contained"
            data-testid="remove-product"
            onClick={ this.handleDeleteCartItem }
          >
            Remover
          </Button>
        </div>
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

// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '@mui/material';
import CartItem from '../components/CartItem';
import Header from '../components/Header';

class ShoppingCart extends Component {
  state = {
    cartItems: [],
    goToCheckout: false,
  };

  componentDidMount() {
    this.refreshCartitems();
  }

  updateChild = () => {
    this.refreshCartitems();
  };

  refreshCartitems = () => {
    const currentLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.setState({ cartItems: currentLocalStorage });
  };

  handleCheckout = () => {
    this.setState({
      goToCheckout: true,
    });
  };

  render() {
    const { cartItems, goToCheckout } = this.state;
    console.log(cartItems);
    return (
      <div>
        <div>
          <Header sx={ { position: 'fixed', top: 0 } } />
        </div>
        <div className="cartitem">
          { cartItems.length === 0 ? (
            <p
              data-testid="shopping-cart-empty-message"
            >
              Seu carrinho está vazio
            </p>
          ) : (
            cartItems.map((cartItem) => (<CartItem
              key={ cartItem.id }
              { ...cartItem }
              update={ this.updateChild }
            />
            ))
          )}
          <Button
            type="button"
            size="small"
            variant="contained"
            data-testid="checkout-products"
            onClick={ this.handleCheckout }
          >
            Fechar compra
          </Button>
          { goToCheckout && <Redirect to="/checkout" /> }
        </div>
      </div>
    );
  }
}

// ShoppingCart.propTypes = {
// second: third
// };

export default ShoppingCart;

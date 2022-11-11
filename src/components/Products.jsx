import { Card } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { handleAddToCart } from '../services/api';

class Products extends Component {
  render() {
    const { title, price, thumbnail, id, shoppingCartQuantitySum,
      available_quantity: availableQuantity, shipping } = this.props;
    const { free_shipping: freteGratis } = shipping;

    return (
      <Card
        data-testid="product"
        className="product"
      >
        <Link
          to={ `/productDetails/${id}` }
          data-testid="product-detail-link"
        >
          <h1>{ title }</h1>
          <img
            alt={ title }
            src={ thumbnail }
          />
          {
            freteGratis && <p data-testid="free-shipping">Frete grátis</p>
          }
          <p>{ price }</p>
        </Link>
        <button
          data-testid="product-add-to-cart"
          type="button"
          onClick={ () => {
            handleAddToCart(title, price, id, availableQuantity);
            shoppingCartQuantitySum();
          } }
        >
          Adicionar ao Carrinho
        </button>
      </Card>
    );
  }
}

Products.propTypes = {
  id: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  shoppingCartQuantitySum: PropTypes.func.isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  available_quantity: PropTypes.number.isRequired,
  shipping: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

};

export default Products;

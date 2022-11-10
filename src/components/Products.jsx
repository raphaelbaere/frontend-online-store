import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { handleAddToCart } from '../services/api';

class Products extends Component {
  render() {
    const { title, price, thumbnail, id, shoppingCartQuantitySum,
      available_quantity: availableQuantity } = this.props;

    return (
      <div
        data-testid="product"
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
      </div>
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
};

export default Products;

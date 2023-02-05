/* eslint-disable react/jsx-max-depth */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import Review from '../components/Review';
import Header from '../components/Header';
import { getProductById, handleAddToCart } from '../services/api';

class ProductDetails extends Component {
  state = {
    properties: {},
    hasLoaded: false,
    redirect: false,
    isFormValid: true,
    inputEmail: '',
    textarea: '',
    note: '0',
    reviews: [],
    totalCartQuantity: 0,
  };

  async componentDidMount() {
    this.getReviews();
    console.log(this.props);
    const { match } = this.props;
    const { params: { id } } = match;
    const response = await getProductById(id);
    const { title, thumbnail, price, available_quantity: availableQuantity } = response;
    this.setState({
      hasLoaded: true,
      properties: {
        title,
        thumbnail,
        price,
        id,
        availableQuantity,

      },
    });
    this.shoppingCartQuantitySum();
  }

  redirectToCart = () => {
    this.setState({
      redirect: true,
    });
  };

  handleInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, this.validationButton);
  };

  addReviewToLocalStorage = () => {
    const { inputEmail, textarea, note } = this.state;
    const { match } = this.props;
    const { params: { id } } = match;

    const currentLocalStorage = JSON.parse(localStorage.getItem(id)) || [];
    const newReview = { inputEmail, textarea, note };
    const newLocaStorage = [...currentLocalStorage, newReview];

    localStorage.setItem(id, JSON.stringify(newLocaStorage));
    this.setState({
      inputEmail: '',
      note: '0',
      textarea: '',
    }, this.getReviews());
  };

  isButtonValid = () => {
    const { inputEmail, note } = this.state;
    const isEmailValid = inputEmail.match(/[0-9a-zA-Z.'/]*@[a-z]+\.com/g);
    return (isEmailValid && note !== '0');
  };

  handleSubmit = () => {
    const isButtonValid = this.isButtonValid();
    if (isButtonValid) this.addReviewToLocalStorage();
    this.setState({
      isFormValid: isButtonValid,
    });
  };

  getReviews = () => {
    const { match } = this.props;
    const { params: { id } } = match;
    const reviews = JSON.parse(localStorage.getItem(id)) || [];
    this.setState({ reviews });
  };

  shoppingCartQuantitySum = () => {
    console.log('a');
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalQuantity = currentCartItems.reduce((acc, curr) => (
      acc + (+curr.quantity)), 0);
    this.setState({ totalCartQuantity: totalQuantity });
  };

  render() {
    const { properties: { title, thumbnail, price, id, availableQuantity },
      hasLoaded, redirect, inputEmail, isFormValid, textarea, note,
      reviews, totalCartQuantity } = this.state;

    return (
      <div>
        <div>
          <Header sx={ { position: 'fixed', top: 0 } } />
        </div>
        <div className="productDetails-content">
          <div className="productDetails-content-details">
            { hasLoaded && (
              <>
                <p data-testid="product-detail-name">{ title }</p>
                <img
                  className="productDetails-img"
                  data-testid="product-detail-image"
                  src={ thumbnail }
                  alt={ title }
                />
                <p data-testid="product-detail-price">
                  R$
                  { price }
                </p>
                <Button
                  className="productDetails-button"
                  data-testid="product-detail-add-to-cart"
                  type="button"
                  size="small"
                  variant="contained"
                  onClick={ () => {
                    handleAddToCart(title, price, id, availableQuantity);
                    this.shoppingCartQuantitySum();
                  } }
                >
                  Add to cart
                </Button>

              </>
            )}
            <Button
              className="productDetails-button"
              data-testid="shopping-cart-button"
              type="button"
              size="small"
              variant="contained"
              onClick={ this.redirectToCart }
            >
              Ir para carrinho!
            </Button>
            <p data-testid="shopping-cart-size">
              Quantidade no carrinho:
              {totalCartQuantity}
            </p>
            { redirect && <Redirect to="/shoppingCart" />}
          </div>
          <form className="productDetails-content-form">
            <p>Avalie o produto:</p>
            <div className="productDetails-email">
              <TextField
                type="email"
                name="inputEmail"
                value={ inputEmail }
                onChange={ this.handleInputChange }
                data-testid="product-detail-email"
                placeholder="Digite seu email"
                required
              />
              <div onChange={ this.handleInputChange }>
                <input
                  checked={ note === '1' }
                  value="1"
                  type="radio"
                  name="note"
                  data-testid="1-rating"
                />
                <input
                  checked={ note === '2' }
                  value="2"
                  type="radio"
                  name="note"
                  data-testid="2-rating"
                />
                <input
                  checked={ note === '3' }
                  value="3"
                  type="radio"
                  name="note"
                  data-testid="3-rating"
                />
                <input
                  checked={ note === '4' }
                  value="4"
                  type="radio"
                  name="note"
                  data-testid="4-rating"
                />
                <input
                  checked={ note === '5' }
                  value="5"
                  type="radio"
                  name="note"
                  data-testid="5-rating"
                />
              </div>
            </div>
            <textarea
              className="productdetails-textarea"
              name="textarea"
              value={ textarea }
              onChange={ this.handleInputChange }
              data-testid="product-detail-evaluation"
              placeholder="Digita sua mensagem"
            />
            <Button
              className="productDetails-button"
              type="button"
              data-testid="submit-review-btn"
              size="small"
              variant="contained"
              onClick={ this.handleSubmit }
            >
              Enviar
            </Button>
            { !isFormValid && <p data-testid="error-msg"> Campos inválidos </p>}
          </form>
          { reviews.length && (
            reviews.map((review) => <Review key={ review.textarea } { ...review } />)
          )}
        </div>
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProductDetails;

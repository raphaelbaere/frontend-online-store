import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Checkout extends Component {
  state = {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    cep: '',
    address: '',
    payment: '',
    isFormValid: true,
    cartItems: [],
    goToHome: false,
  };

  componentDidMount() {
    this.fetchCartitems();
  }

  handleInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  isFormValid = () => {
    const { name, cpf, email, phone, cep, address, payment } = this.state;
    const arr = [name, cpf, phone, cep, address, payment];
    const isFieldsValid = arr.every((campo) => campo.length > 0);
    const isEmailValid = email.match(/[0-9a-zA-Z.'/]*@[a-z]+\.com/g);
    const isValid = isFieldsValid && isEmailValid;
    this.setState({
      isFormValid: isValid,
    });
    return isValid;
  };

  handleSubmit = () => {
    const isValid = this.isFormValid();
    if (isValid) {
      localStorage.setItem('cartItems', JSON.stringify([]));
      this.fetchCartitems();
      this.setState({
        goToHome: true,
      });
    }
  };

  fetchCartitems = () => {
    const currentLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.setState({ cartItems: currentLocalStorage });
  };

  render() {
    const { name, cpf, email, phone, cep,
      address, payment, isFormValid, cartItems, goToHome } = this.state;
    return (
      <div>
        { cartItems.length === 0 ? (
          <p
            data-testid="shopping-cart-empty-message"
          >
            Seu carrinho está vazio
          </p>
        ) : (
          cartItems.map((cartItem) => (
            <p key={ cartItem.id }>
              { cartItem.title }
            </p>
          ))
        )}

        <form>
          <input
            type="text"
            name="name"
            data-testid="checkout-fullname"
            placeholder="Nome Completo"
            value={ name }
            onChange={ this.handleInputChange }
          />
          <input
            type="text"
            name="cpf"
            data-testid="checkout-cpf"
            placeholder="CPF"
            value={ cpf }
            onChange={ this.handleInputChange }
          />
          <input
            type="email"
            name="email"
            data-testid="checkout-email"
            placeholder="Email"
            value={ email }
            onChange={ this.handleInputChange }
          />
          <input
            type="text"
            name="phone"
            data-testid="checkout-phone"
            placeholder="Telefone"
            value={ phone }
            onChange={ this.handleInputChange }
          />
          <input
            type="text"
            name="cep"
            data-testid="checkout-cep"
            placeholder="CEP"
            value={ cep }
            onChange={ this.handleInputChange }
          />
          <input
            type="text"
            name="address"
            data-testid="checkout-address"
            placeholder="Endereço"
            value={ address }
            onChange={ this.handleInputChange }
          />
          <div onChange={ this.handleInputChange }>
            <input
              checked={ payment === 'ticket' }
              value="ticket"
              type="radio"
              name="payment"
              data-testid="ticket-payment"
            />
            <input
              checked={ payment === 'visa' }
              value="visa"
              type="radio"
              name="payment"
              data-testid="visa-payment"
            />
            <input
              checked={ payment === 'master' }
              value="master"
              type="radio"
              name="payment"
              data-testid="master-payment"
            />
            <input
              checked={ payment === 'elo' }
              value="elo"
              type="radio"
              name="payment"
              data-testid="elo-payment"
            />
          </div>
          <button
            type="button"
            data-testid="checkout-btn"
            onClick={ this.handleSubmit }
          >
            Comprar

          </button>
        </form>
        { !isFormValid && <p data-testid="error-msg">Campos inválidos</p>}
        { goToHome && <Redirect to="/" /> }
      </div>
    );
  }
}
// checkout page

export default Checkout;

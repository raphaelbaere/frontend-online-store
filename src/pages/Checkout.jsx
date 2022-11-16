import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, IconButton } from '@mui/material';
import Header from '../components/Header';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

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
        <div>
          <Header sx={ { position: 'fixed', top: 0 } } />
        </div>
        <div className="checkout-content">
          <div className="checkout-cartitem">
            <p>Produtos no carrinho:</p>
            <br />
            { cartItems.length === 0 ? (
              <p
                data-testid="shopping-cart-empty-message"
              >
                Seu carrinho está vazio
              </p>
            ) : (
              cartItems.map((cartItem) => (
                <li key={ cartItem.id }>
                  { cartItem.title }
                </li>
              ))
            )}
          </div>
          <div className="checkout-form">
            <FormControl>
              <p>Para concluir a compra, preencha com seus dados:</p>
              <br />
              <InputLabel id="Nome Completo"> </InputLabel>
              <TextField
                type="text"
                name="name"
                size="small"
                data-testid="checkout-fullname"
                label="Nome Completo"
                id="Nome Completo"
                value={ name }
                onChange={ this.handleInputChange }
              />
              <br />
              <InputLabel id="CPF"> </InputLabel>
              <TextField
                type="text"
                name="cpf"
                size="small"
                data-testid="checkout-cpf"
                label="CPF"
                id="CPF"
                value={ cpf }
                onChange={ this.handleInputChange }
              />
              <br />
              <InputLabel id="Email"> </InputLabel>
              <TextField
                type="email"
                name="email"
                size="small"
                data-testid="checkout-email"
                label="Email"
                id="Email"
                value={ email }
                onChange={ this.handleInputChange }
              />
              <br />
              <InputLabel id="Telefone"> </InputLabel>
              <TextField
                type="text"
                name="phone"
                size="small"
                data-testid="checkout-phone"
                label="Telefone"
                id="Telefone"
                value={ phone }
                onChange={ this.handleInputChange }
              />
              <br />
              <InputLabel id="CEP"> </InputLabel>
              <TextField
                type="text"
                name="cep"
                size="small"
                data-testid="checkout-cep"
                label="CEP"
                id="CEP"
                value={ cep }
                onChange={ this.handleInputChange }
              />
              <br />
              <InputLabel id="Endereço"> </InputLabel>
              <TextField
                type="text"
                name="address"
                size="small"
                data-testid="checkout-address"
                label="Endereço"
                id="Endereço"
                value={ address }
                onChange={ this.handleInputChange }
              />
              <br />
              <p>Escolha uma forma de pagamento:</p>
              <div
              className="checkout-payment"
              onChange={ this.handleInputChange }
              >
                <input
                  checked={ payment === 'ticket' }
                  value="ticket"
                  type="radio"
                  name="payment"
                  data-testid="ticket-payment"
                />Ticket
                <input
                  checked={ payment === 'visa' }
                  value="visa"
                  type="radio"
                  name="payment"
                  data-testid="visa-payment"
                />Visa
                <input
                  checked={ payment === 'master' }
                  value="master"
                  type="radio"
                  name="payment"
                  data-testid="master-payment"
                />Master
                <input
                  checked={ payment === 'elo' }
                  value="elo"
                  type="radio"
                  name="payment"
                  data-testid="elo-payment"
                />Elo
              </div>
              <br />
              <Button
                type="Button"
                size="small"
                variant="contained"
                data-testid="checkout-btn"
                onClick={ this.handleSubmit }
              >
                Comprar

              </Button>
              <br />
              { !isFormValid && <p data-testid="error-msg">Campos inválidos</p>}
            </FormControl>
          </div>
          { goToHome && <Redirect to="/" /> }
        </div>
      </div>
    );
  }
}
// checkout page

export default Checkout;

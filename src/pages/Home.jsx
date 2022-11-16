import { Button, TextField, Select, MenuItem, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Header from '../components/Header';
import Products from '../components/Products';
import { getProductsFromCategoryAndQuery,
  getCategories, getProductsFromCategory } from '../services/api';
import CartItem from '../components/CartItem';

class Home extends Component {
  state = {
    redirectToShoppingCart: false,
    categories: [],
    queryInput: '',
    currentCategory: '',
    resultQueryProducts: [],
    totalCartQuantity: 0,
    selectSort: 'none',
    showCartPreview: false,
    cartItems: [],
  };

  async componentDidMount() {
    const requestApi = await this.requestApi();
    this.setState({
      categories: requestApi,
    });
    this.shoppingCartQuantitySum();
    this.refreshCartitems();
  }

  requestApi = async () => {
    const api = await getCategories();
    return api;
  };

  onCategoryButtonClick = async (id) => {
    this.setCategory(id);
    const clickedCategory = await getProductsFromCategory(id);
    const { results } = clickedCategory;
    this.setState({ resultQueryProducts: results });
  };

  setCategory = (id) => {
    this.setState({
      currentCategory: id,
    });
  };

  handleCategory = (param) => {
    const categories = param.map(({ name, id }) => (
      <label key={ id } htmlFor={ id } data-testid="category">
        <input
          onClick={ () => this.onCategoryButtonClick(id) }
          name={ name }
          id={ id }
          type="radio"
        />
        { name }
      </label>
    ));
    return categories;
  };

  handleOnChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleQueryButton = async () => {
    const { currentCategory, queryInput } = this.state;
    const queryProducts = await
    getProductsFromCategoryAndQuery(
      currentCategory,
      queryInput,
    );
    const resultQueryProducts = queryProducts.results;
    this.setState({ resultQueryProducts });
  };

  handleSort = async (event) => {
    const { value } = event.target;
    this.handleOnChange(event);
    const { resultQueryProducts } = this.state;

    const sortFunctions = {
      crescent: (a, b) => a.price - b.price,
      decrescent: (a, b) => b.price - a.price,
    };
    const sortFunctionToUse = sortFunctions[value];
    const sortedQuery = resultQueryProducts.sort(sortFunctionToUse);
    this.setState({ resultQueryProducts: sortedQuery });
  };

  shoppingCartQuantitySum = () => {
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const totalQuantity = currentCartItems.reduce((acc, curr) => (
      acc + (+curr.quantity)), 0);
    this.setState({ totalCartQuantity: totalQuantity });
  };

  onCartPreviewClick = () => {
    this.refreshCartitems();
    this.setState((prevState) => ({
      showCartPreview: !prevState.showCartPreview,
    }));
  };

  refreshCartitems = () => {
    const currentLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.setState({ cartItems: currentLocalStorage });
  };

  render() {
    const { redirectToShoppingCart, categories, queryInput,
      resultQueryProducts, totalCartQuantity, selectSort, showCartPreview,
      cartItems } = this.state;
    return (
      <div>
        <div>
          <Header sx={ { position: 'fixed', top: 0 } } />
        </div>
        <div className="main">
          {categories.length === 0 ? (
            <h1 data-testid="home-initial-message">
              Digite algum termo de pesquisa ou escolha uma categoria.
            </h1>
          ) : (
            <div className="categories">
              <p>Categorias</p>
              <br />
              {this.handleCategory(categories)}
            </div>
          )}
          <div className="products">
            <div className="search-area">
              <TextField
                type="text"
                data-testid="query-input"
                value={ queryInput }
                name="queryInput"
                onChange={ this.handleOnChange }
                label="Procure por produtos"
              />
              <Button
                type="button"
                data-testid="query-button"
                onClick={ this.handleQueryButton }
                variant="contained"
              >
                Pesquisar
              </Button>
              <FormControl>
                <InputLabel id="filter">Filtro</InputLabel>
                <Select
                  name="sortByPrice"
                  id="filter"
                  onChange={ this.handleSort }
                  label="Filtro"
                  sx={ { width: 225 } }
                >
                  <MenuItem
                    selected={ selectSort === 'none' }
                    value="none"
                  >
                    Nenhum
                  </MenuItem>
                  <MenuItem
                    selected={ selectSort === 'crescent' }
                    value="crescent"
                  >
                    Ordernar Menor Preço
                  </MenuItem>
                  <MenuItem
                    selected={ selectSort === 'decrescent' }
                    value="decrescent"
                  >
                    Ordernar Maior Preço
                  </MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={ this.onCartPreviewClick } sx={ { position: 'absolute', right: 18 } }>
                <ShoppingCartIcon sx={ { transform: 'rotateY(180deg)' } } />
                <p data-testid="shopping-cart-size">{totalCartQuantity}</p>
              </IconButton>
            </div>
            {
              !resultQueryProducts.length ? (
                <p>Nenhum produto foi encontrado</p>
              ) : (
                resultQueryProducts
                  .map((result) => (
                    <Products
                      key={ result.id }
                      { ...result }
                      shoppingCartQuantitySum={ this.shoppingCartQuantitySum }
                      refreshCartItems={ this.refreshCartitems }
                    />))
              )
            }
          </div>
        </div>
        {showCartPreview && (
          <div className="cartPreview rounded shadow text-white text-center">
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
                shoppingCartQuantitySum={ this.shoppingCartQuantitySum }
                refreshCartItems={ this.refreshCartitems }
              />
              ))
            )}
            <button
              type="button"
              data-testid="shopping-cart-button"
              onClick={ () => this.setState({ redirectToShoppingCart: true }) }
            >
              Ir para carrinho de compras
            </button>
            { redirectToShoppingCart && <Redirect to="/shoppingCart" />}
          </div>
        )}
      </div>
    );
  }
}
export default Home;

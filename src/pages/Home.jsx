import { Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Products from '../components/Products';
import { getProductsFromCategoryAndQuery,
  getCategories, getProductsFromCategory } from '../services/api';

class Home extends Component {
  state = {
    redirectToShoppingCart: false,
    categories: [],
    queryInput: '',
    currentCategory: '',
    resultQueryProducts: [],
    totalCartQuantity: 0,
    selectSort: 'none',
  };

  async componentDidMount() {
    const requestApi = await this.requestApi();
    this.setState({
      categories: requestApi,
    });
    this.shoppingCartQuantitySum();
  }

  requestApi = async () => {
    const api = await getCategories();
    return api;
  };

  onCategoryButtonClick = async (id) => {
    this.setCategory(id);
    const clickedCategory = await getProductsFromCategory(id);
    console.log(clickedCategory.results);
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

  render() {
    const { redirectToShoppingCart, categories, queryInput,
      resultQueryProducts, totalCartQuantity, selectSort } = this.state;
    return (
      <div>
        <div>
          <Header />
        </div>
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
            Query!
          </Button>
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
        </div>
        <div className="main">
          {categories.length === 0 ? (
            <h1 data-testid="home-initial-message">
              Digite algum termo de pesquisa ou escolha uma categoria.
            </h1>
          ) : (
            <div className="categories">{this.handleCategory(categories)}</div>
          )}
          <div className="products">
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
                    />))
              )
            }
          </div>
          <button
            type="button"
            data-testid="shopping-cart-button"
            onClick={ () => this.setState({ redirectToShoppingCart: true }) }
          >
            Carrinho de compras
          </button>
          <p data-testid="shopping-cart-size">{totalCartQuantity}</p>
          { redirectToShoppingCart && <Redirect to="/shoppingCart" />}
        </div>
      </div>
    );
  }
}
export default Home;

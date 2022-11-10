import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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
    getProductsFromCategoryAndQuery(currentCategory, queryInput);
    const resultQueryProducts = queryProducts.results;
    console.log(resultQueryProducts);
    this.setState({ resultQueryProducts });
  };

  shoppingCartQuantitySum = () => {
    console.log('a');
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const totalQuantity = currentCartItems.reduce((acc, curr) => (
      acc + (+curr.quantity)), 0);
    this.setState({ totalCartQuantity: totalQuantity });
  };

  render() {
    const { redirectToShoppingCart, categories, queryInput,
      resultQueryProducts, totalCartQuantity } = this.state;
    return (
      <div>
        <input
          data-testid="query-input"
          value={ queryInput }
          name="queryInput"
          onChange={ this.handleOnChange }
        />
        <button
          type="button"
          data-testid="query-button"
          onClick={ this.handleQueryButton }
        >
          Query!
        </button>
        {categories.length === 0 ? (
          <h1 data-testid="home-initial-message">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </h1>
        ) : (
          <div>{this.handleCategory(categories)}</div>
        )}
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
    );
  }
}
export default Home;

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { handleAddToCart } from '../services/api';

class Products extends Component {
  render() {
    const { title, price, thumbnail, id, shoppingCartQuantitySum,
      available_quantity: availableQuantity, shipping, refreshCartItems } = this.props;
    const { free_shipping: freteGratis } = shipping;

    return (
      <Card
        sx={ { maxWidth: 145 } }
        data-testid="product"
        className="product"
      >
        <CardActionArea>
          <CardContent>
            <Link
              to={ `/productDetails/${id}` }
              data-testid="product-detail-link"
            >
              <CardMedia
                component="img"
                image={ thumbnail }
                alt={ title }
              />
              <Typography>{ title }</Typography>
              <br />
              {
                freteGratis && <p data-testid="free-shipping">Frete grátis</p>
              }
              <br />
              <p>
                R$
                { price }
              </p>
            </Link>
          </CardContent>
          <CardActions>
            <Button
              data-testid="product-add-to-cart"
              type="button"
              size="small"
              variant="contained"
              onClick={ () => {
                handleAddToCart(title, price, id, availableQuantity);
                shoppingCartQuantitySum();
                refreshCartItems();
              } }
            >
              Adicionar ao Carrinho
            </Button>
          </CardActions>
        </CardActionArea>
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

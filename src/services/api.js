export async function getCategories() {
  const url = 'https://api.mercadolibre.com/sites/MLB/categories';
  const response = await fetch(url);
  const obj = await response.json();
  return obj;
}

export async function getProductsFromCategoryAndQuery(categoryId, query) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`;
  const response = await fetch(url);
  const obj = await response.json();
  return obj;
}

export async function getProductsFromCategory(categoryId) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}`;
  const response = await fetch(url);
  const obj = await response.json();
  return obj;
}

export async function getProductById(productId) {
  const url = `https://api.mercadolibre.com/items/${productId}`;
  const response = await fetch(url);
  const obj = await response.json();
  return obj;
}
export function handleAddToCart(title, price, id, availableQuantity) {
  const currentLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];

  const indexOfExistent = currentLocalStorage
    .findIndex((cartItems) => cartItems.id === id);

  const INDEX_OF_NO_EXISTENT = -1;
  if (indexOfExistent !== INDEX_OF_NO_EXISTENT) {
    currentLocalStorage[indexOfExistent].quantity += 1;
  } else {
    const product = {
      title,
      price,
      id,
      quantity: 1,
      availableQuantity,
    };
    currentLocalStorage.push(product);
  }

  localStorage.setItem('cartItems', JSON.stringify(currentLocalStorage));
}

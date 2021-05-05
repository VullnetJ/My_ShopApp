export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

// reduc action for adding products to the cart. 
export const addToCart = product => {
  return { type: ADD_TO_CART, product: product };
};
// for removing products from the cart
export const removeFromCart = productId => {
  return { type: REMOVE_FROM_CART, pid: productId };
};

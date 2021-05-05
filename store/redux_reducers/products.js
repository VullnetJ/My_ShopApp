// import PRODUCTS from '../../temporary_data/local_data';

import { REMOVE_PRODUCT, CREATE_A_NEW_PRODUCT, MODIFY_PRODUCT, SET_PRODUCTS } from '../redux_actions/products';
import Product from '../../constructor/product';


// the initial state where are listed all products that are available and products that the user has. 
const initialState = {
  currentProductsAvailable: [],
  userProducts: [],
};

// here we have only synchronous code.
// case to set products for the user. 
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        currentProductsAvailable: action.products,
        userProducts: action.userProducts,
      };

      // caase to create new products for the user. 
    case CREATE_A_NEW_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.productOwnerID,
        action.productData.title,
        action.productData.photo_link,
        action.productData.desc,
        action.productData.price
      );
      return {
        ...state,
        currentProductsAvailable: state.currentProductsAvailable.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };

    // case when the user modifies the product. 
    case MODIFY_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].productOwnerID,
        action.productData.title,
        action.productData.photo_link,
        action.productData.desc,
        state.userProducts[productIndex].price
      );
      const userProductsUpdated = [...state.userProducts];
      userProductsUpdated[productIndex] = updatedProduct;
      const availableProductIndex = state.currentProductsAvailable.findIndex(
        prod => prod.id === action.pid
      );
      const productsAvailableUpdated = [...state.currentProductsAvailable];
      productsAvailableUpdated[availableProductIndex] = updatedProduct;
      return {
        ...state,
        currentProductsAvailable: productsAvailableUpdated,
        userProducts: userProductsUpdated
      };
    // case when the user removes the products from the shopping app. 
    case REMOVE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.pid
        ),
        currentProductsAvailable: state.currentProductsAvailable.filter(
          product => product.id !== action.pid
        )
      };
  }
  return state;
};

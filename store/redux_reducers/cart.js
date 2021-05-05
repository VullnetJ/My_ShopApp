import { ADD_ORDER } from '../redux_actions/orders';
import { REMOVE_PRODUCT } from '../redux_actions/products';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../redux_actions/cart';
import CartItem from '../../constructor/cart-item';

// initial cart includes itial items and total amount which is empty. 
const initialState = {
  items: {},
  totalAmount: 0
};

// when the user adds item to the card with relevant information. 
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let itemsToBeUpdatedOrNewInCart;

      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        itemsToBeUpdatedOrNewInCart = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        itemsToBeUpdatedOrNewInCart = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: itemsToBeUpdatedOrNewInCart },
        totalAmount: state.totalAmount + prodPrice
      }; 

    // case when the user removes items from the cart, and quantity is substracted
    // as well as other relevant information are removed from the cart

    case REMOVE_FROM_CART:
      const chosenItemInCart = state.items[action.pid];
      const currentQty = chosenItemInCart.quantity;
      let itemsUpdatedInCart;
      if (currentQty > 1) {
        // need to reduce it, not erase it
        const updatedCartItem = new CartItem(
          chosenItemInCart.quantity - 1,
          chosenItemInCart.pPrice,
          chosenItemInCart.pTitle,
          chosenItemInCart.sum - chosenItemInCart.pPrice
        );
        itemsUpdatedInCart = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        itemsUpdatedInCart = { ...state.items };
        delete itemsUpdatedInCart[action.pid];
      }
      return {
        ...state,
        items: itemsUpdatedInCart,
        totalAmount: state.totalAmount - chosenItemInCart.pPrice
      };

      // when adding an order inital state is returned which includes items that are added to the cart (if there are any)
      case ADD_ORDER:
        return initialState;

      // remove products from the cart. 
      case REMOVE_PRODUCT:
        if(!state.items[action.pid])
        return state;
        const itemsUpdated = {...state.items};
        const itemTotal = state.items[action.pid].sum;
        delete itemsUpdated[action.pid];
        return {
          ...state,
          items: itemsUpdated,
          totalAmount: state.totalAmount - itemTotal
        }

  }

  return state;
};
  

                    

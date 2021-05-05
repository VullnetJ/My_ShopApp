import { ADD_ORDER, SET_ORDERS } from '../redux_actions/orders';
import Order from '../../constructor/order';

// initial orders is an empty array. Typically there arent any orders at the begining. 
const initialState = {
  orders: []
};
// when the users sets the order. 
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS: {
      return {
        orders: action.orders
      }
    }

    // here we receive the date from outside too. 
    // the user places an order. 
    case ADD_ORDER:
      const makeNewOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date,
        
      );
      return {
        ...state,
        orders: state.orders.concat(makeNewOrder)
      };
  }

  return state;
};

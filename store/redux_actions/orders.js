
import Order from '../../constructor/order';
export const SET_ORDERS = 'SET_ORDERS';
export const ADD_ORDER = 'ADD_ORDER';

// the action creater retruns asynch dispach function provided by Redux Thunk
// and then we dispatch it or send a new action where the type is SET_ORDERs. 
// fetching order from firebase database based on userId. 

export const fetchOrders = () => {
  return async (dispatch, getState ) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://shop-app-65e88-default-rtdb.europe-west1.firebasedatabase.app/orders/${userId}.json`,
      );

      if (!response.ok) {
        throw new Error('Order is not fetched, something went wrong!');
      }

      const resData = await response.json();
      const loadedOrders = [];

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].data),
            
          )
        );
      }
    dispatch({type: SET_ORDERS, orders: loadedOrders});
  } catch (err) {
    throw err;
  }
  }
}

// adding orders based on userId and total amount, 
export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState ) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId; //this gives the id of currently logged in user
   
   // the date stamp is same as locally running in the app and also on the server. 
    const date = new Date();
    const response = await fetch(
      `https://shop-app-65e88-default-rtdb.europe-west1.firebasedatabase.app/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString()
        })
      }
    );
    if (!response.ok) {
      throw new Error('Something went wrong while storing your order.')
    }
    const resData = await response.json();

    dispatch({
        type: ADD_ORDER,
        orderData: {
          id: resData.name, 
          items: cartItems, 
          amount: totalAmount, 
          date: date }
      });
  }
};

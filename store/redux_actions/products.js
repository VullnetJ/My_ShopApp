export const CREATE_A_NEW_PRODUCT = 'CREATE_A_NEW_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const MODIFY_PRODUCT = 'MODIFY_PRODUCT';
import Product from '../../constructor/product';


// the action creater is asynchronous. So we can send a request as part of the action creater. 
// after we are done with that we dispatch the action to the reducer. 
// get products from the firebase and set them in the store. 

// the request is send to the url where the products are stored. By default the fetching is by GET request. 
// fetching the producsts from firebase

export const fetchProducts = () => {
  return async (dispatch, getState) => {
  
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://shop-app-65e88-default-rtdb.europe-west1.firebasedatabase.app/products.json',
      );

      if (!response.ok) {
        throw new Error('Fetching products did not succeed, something went wrong!');
      }

      const responseData = await response.json();
      const productsLoading = [];
      // the array increases with putting new products with 'push'. 
      // since we work with an array, we need to transform. We use for loop to loop through the object 
      // that firebase sends, so we map the object data in the array. 

      for (const key in responseData) {
        productsLoading.push(
          new Product(
            key,
            responseData[key].productOwnerID,
            responseData[key].title,
            responseData[key].photo_link,
            responseData[key].desc,
            responseData[key].price
          )
        );
      }

      dispatch({ 
        type: SET_PRODUCTS, 
        products: productsLoading, 
        userProducts: productsLoading.filter(prod => prod.productOwnerID === userId) 
      });
    } catch (err) {
      // if want can send error to analyze what happened. 
      throw err;
    }
  };
};

//Here is handled deleting rpoduct from firebase database which includes product id and token. 
// 
export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shop-app-65e88-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Product was not deleted, something went wrong!');
    }
    dispatch({ type: REMOVE_PRODUCT, pid: productId });
  };
};

// here is created a product by the user and stored to the firebase database. 

export const createProduct = (title, desc, photo_link, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://shop-app-65e88-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          desc,
          photo_link,
          price,
          productOwnerID: userId
        })
      }
    );

    const responseData = await response.json();

    dispatch({
      type: CREATE_A_NEW_PRODUCT,
      productData: {
        id: responseData.name,
        title,
        desc,
        photo_link,
        price,
        productOwnerID: userId
      }
    });
  };
};

// when the user wants to update the product then we use dispatch to not re-create again all products 
// but rather just update information that the user changes. 

export const updateProduct = (id, title, desc, photo_link) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shop-app-65e88-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          desc,
          photo_link,
        })
      }
    );

    dispatch({
      type: MODIFY_PRODUCT,
      pid: id,
      productData: {
        title,
        desc,
        photo_link
      }
    });
  };
};

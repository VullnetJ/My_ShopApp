import React from 'react';
import AppLoading from 'expo-app-loading';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import productsReducer from './store/redux_reducers/products';
import NavigationContainer from './navigation_wrapper/NavigationContainer';
import authReducer from './store/redux_reducers/authentication';
import cartReducer from './store/redux_reducers/cart';
import ordersReducer from './store/redux_reducers/orders';
import { useFonts } from 'expo-font';

// combineReducers calls every child reducer, and gathers their results into a single state object. 
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
});

//createStore holds the complete state tree of the app. So it is only one store in the app.

//dispatch action. 

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

// using useFonts hook in the root of the app to implement custom fonts. 
export default function App(props) {
  let [loadCustomFonts] = useFonts({
   
    'Source-Sans-Pro-Black': require('./custom_font/myFonts/SourceSansPro-Black.ttf'),
    'Source-Sans-Pro-Bold': require('./custom_font/myFonts/SourceSansPro-Bold.ttf'),
    'Source-Sans-Pro-BoldItalic': require('./custom_font/myFonts/SourceSansPro-BoldItalic.ttf'),
    'Source-Sans-Pro-Italic': require('./custom_font/myFonts/SourceSansPro-Italic.ttf'),
    'Source-Sans-Pro-Light': require('./custom_font/myFonts/SourceSansPro-Light.ttf'),
    'Source-Sans-Pro': require('./custom_font/myFonts/SourceSansPro-Regular.ttf'),
    'Source-Sans-Pro-SemiBold': require('./custom_font/myFonts/SourceSansPro-SemiBold.ttf'),
    'Source-Sans-Pro-SemiBoldItalic': require('./custom_font/myFonts/SourceSansPro-SemiBoldItalic.ttf'),
  });
  
  // <AppLoading this is to keep the splash screen visible while AppLoading component is mounted. 
  // The fonts are being downloaded on the device.  
  // Provider makes the Redux store available to nested components that need access to the Redux store. 
  
  
  if (!loadCustomFonts) {
    return <AppLoading />;
  }else {
     return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
  }
 
}

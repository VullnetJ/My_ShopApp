import React from 'react';
import {createStackNavigator, createDrawerNavigator, createSwitchNavigator, createAppContainer, DrawerItems } from 'react-navigation';
import Colors from '../custom_colors/Colors';
import { Platform, SafeAreaView, Button, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/redux_actions/authentication';
import OrderView from '../shop_view_main/shop_view/OrderView';
import Authentication from '../shop_view_main/user_view/Authentication';
import FirstSreen from '../shop_view_main/FirstScreen';
import ProductsView from '../shop_view_main/shop_view/ProductsView';
import DetailView from '../shop_view_main/shop_view/DetailView';
import CartView from '../shop_view_main/shop_view/CartView';
import ProductsForUsers from '../shop_view_main/user_view/ProductsForUsers';
import ModifyProduct from '../shop_view_main/user_view/ModifyProduct';

// the defaultNagOptions is used for screens. 

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.second
  },
  headerTitleStyle: {
    fontFamily: 'Source-Sans-Pro-Bold',

  },
  headerBackTitleStyle: {
    fontFamily: 'Source-Sans-Pro',
  },
  headerTintColor: 'orange',
 
};
// transition between screens.
const NavigationToProducts = createStackNavigator(
  {
    ProductsView: ProductsView,
    ProductDetail: DetailView,
    Cart: CartView,
    
  },
  {
    navigationOptions: {   
      drawerIcon: (
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
          size={30}
          color= 'darkred'
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const NavigationToOrders = createStackNavigator(
  {
    Orders: OrderView
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'}
          size={30}
          color= 'dodgerblue'
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);
        

const NavigationToSuperUser = createStackNavigator(
    {
      UserProducts: ProductsForUsers,
      EditProduct: ModifyProduct
    },
    {
      navigationOptions: {
        drawerIcon: (
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-create' : 'md-create'}
            size={30}
            color= 'mediumvioletred'
          />
        )
      },
      defaultNavigationOptions: defaultNavOptions
    }
  );

    //createDrawerNavigator Open and close via gesture, from the left to the right. 

  const NavigationToShop = createDrawerNavigator(
    { 
      All_Products: NavigationToProducts,
      Super_User: NavigationToSuperUser,
      Your_Orders: NavigationToOrders,
      
    },
    
    {
      contentOptions: {
        activeTintColor: Colors.second,
      },
      contentComponent: props => {
        const dispatch = useDispatch();
        return <View style={styles.container}>
            <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}> 
              <DrawerItems {...props} />
              <Button 
                title="Signout" 
                colors={Colors.first} 
                onPress={() => {
                  dispatch(authActions.logout());
              }} />
            </SafeAreaView>
        </View>
      }
      
    },

  );
  // forceInset aids in ensuring that the application displays correctly on the iPhone X and other devices with notches and "safe areas".

  const NavigationToAuthentication = createStackNavigator(
    {
      Authentication: Authentication
    },
    {
      defaultNavigationOptions: defaultNavOptions
    }
  );
  
  // this shows only one screen at a time. So the users can not go back. 
  //After the user is authenticated, they can not go back again. 
  
  const MainNavigator = createSwitchNavigator({
    First: FirstSreen,
    Authentication: NavigationToAuthentication,
    Shop: NavigationToShop
  });
  
  const styles = StyleSheet.create({
    container: {
      flex: 1, 
      paddingTop: 30, 
      backgroundColor: 'mistyrose',
      borderRadius: 1,
      borderWidth: 3,
      borderColor: 'orange'
    },
  });

  export default createAppContainer(MainNavigator);
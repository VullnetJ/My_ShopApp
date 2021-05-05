import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {StyleSheet, ActivityIndicator, Platform, FlatList, View, Text, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as cartActions from '../../store/redux_actions/cart';
import * as productsActions from '../../store/redux_actions/products';
import Colors from '../../custom_colors/Colors';
import HeaderButton from '../../items_and_UI/UserInterface/HeaderButton';
import ProductItem from '../../items_and_UI/all_items/Item_in_Product';

// whenever we visit this, it will be loaded the latest products. 
const ProductsView = props => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const products = useSelector(state => state.products.currentProductsAvailable);
  const dispatch = useDispatch();

  const productsLoading = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);
// it will run when ever the component is loaded. 
  useEffect(() => {
    const focus = props.navigation.addListener(
      'willFocus',
      productsLoading
    );

    return () => {
      focus.remove();
    };
  }, [productsLoading]);

  // it will run only when the component is loaded. 
  useEffect(() => {
    setIsLoading(true);
    productsLoading().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, productsLoading]);

  const chosenItemHandling = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      pTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={productsLoading}
          color={Colors.first}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>There are not any products, you can add some</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={productsLoading}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.photo_link}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            chosenItemHandling(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="See more Info"
            onPress={() => {
              chosenItemHandling(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="Add to your Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsView.navigationOptions = navData => {
  return {
    headerTitle: 'All products available',
    headerStyle: {
      backgroundColor: 'plum',
      },
    headerTintColor: 'blue',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProductsView;

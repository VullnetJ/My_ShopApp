import React from 'react';
import { useDispatch, useSelector, } from 'react-redux';
import { Alert, View, Text,FlatList, Button, Platform, } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Colors from '../../custom_colors/Colors';
import HeaderButton from '../../items_and_UI/UserInterface/HeaderButton';
import ProductItem from '../../items_and_UI/all_items/Item_in_Product';
import * as productsActions from '../../store/redux_actions/products';

//The view that the user can use to either edit products or delete them. 
const ProductsForUsers = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = id => {
    props.navigation.navigate('EditProduct', { productId: id });
  };

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Are you 100% sure you want to delete this?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        }
      }
    ]);
  };

  if (userProducts.length === 0 ) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>There are no any products. You can add new products. </Text>
    </View>
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.photo_link}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.fourth}
            title="Modify Product"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.fourth}
            title="Delete Product"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsForUsers.navigationOptions = navData => {
  return {
    headerTitle: 'Add or modify products',
    headerStyle: {
      backgroundColor: 'plum',
      },
    headerTintColor: 'blue',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 22,
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
          title="Add"
          iconName={Platform.OS === 'ios' ? 'ios-create' : 'md-create'}
          onPress={() => {
            navData.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    )
  };
};

export default ProductsForUsers;

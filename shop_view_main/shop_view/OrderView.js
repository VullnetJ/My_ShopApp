import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet,  Platform, Text, View, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import OrderItem from '../../items_and_UI/all_items/Item_in_Order';
import * as ordersActions from '../../store/redux_actions/orders';
import HeaderButton from '../../items_and_UI/UserInterface/HeaderButton';
import Colors from '../../custom_colors/Colors';


// the view where is displayed order. 
const OrderView = props => {
  const [isLoading, setIsLoading] = useState(false);

  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(ordersActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={Colors.first} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Currently there are not any orders. You could place some orders!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrderView.navigationOptions = navData => {
  return {
    headerTitle: 'Check your orders',
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
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default OrderView;

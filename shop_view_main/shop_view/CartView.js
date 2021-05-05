import { useSelector, useDispatch } from 'react-redux';
import React, {useState} from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import * as cartActions from '../../store/redux_actions/cart';
import * as ordersActions from '../../store/redux_actions/orders';
import CartItem from '../../items_and_UI/all_items/Item_in_Cart';
import Colors from '../../custom_colors/Colors';
import Card from '../../items_and_UI/UserInterface/Card';

// this is the view for the Cart where it includes total amount, items, title of the product, price, quantity and the sum

const CartView = props => {
  const [isLoading, setIsLoading] = useState(false);

  const tAmountForCart = useSelector(state => state.cart.totalAmount);
  const cartItems = useSelector(state => {
    const changedCartItems = [];
    for (const key in state.cart.items) {
      changedCartItems.push({
        productId: key,
        pTitle: state.cart.items[key].pTitle,
        pPrice: state.cart.items[key].pPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return changedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  const dispatch = useDispatch();

  // send the order. 
  const handleOrder = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, tAmountForCart));
    setIsLoading(false);
  };
  //ActivityIndicator will display a cirular loading indicator. When it is fast than it is not visible. 
  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.text_total}>
          Total:{' '}
          <Text style={styles.amount}>
            ${Math.round(tAmountForCart.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.first} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={handleOrder}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.pTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartView.navigationOptions = {
  headerTitle: 'Check your cart',
  headerStyle: {
    backgroundColor: 'plum',
    },
  headerTintColor: 'blue',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    justifyContent: 'space-between',
  },
  text_total: {
    fontFamily: 'Source-Sans-Pro-Bold',
    fontSize: 20,
  },
  amount: {
    color: Colors.second
  }
});

export default CartView;

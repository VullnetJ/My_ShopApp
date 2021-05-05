import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Card from '../UserInterface/Card';
import Colors from '../../custom_colors/Colors';
import CartItem from './Item_in_Cart';

const OrderItem = props => {
  const [displayMoreInfo, setDisplayMoreInfo] = useState(false);

  return (
    <Card style={styles.item_in_order}>
      <View style={styles.view}>
        <Text style={styles.amount}>${props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button
        color={Colors.fourth}
        title={displayMoreInfo ? 'Hide Info' : 'Show more Info'}
        onPress={() => {
          setDisplayMoreInfo(prevState => !prevState);
        }}
      />
      {displayMoreInfo && (
        <View style={styles.moreInfo}>
          {props.items.map(cartItem => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              title={cartItem.productTitle}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  item_in_order: {
    margin: 22,
    alignItems: 'center',
    padding: 18,
    
  },
  view: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    
  },
  date: {
    fontSize: 18,
    fontFamily: 'Source-Sans-Pro',
    color: 'indigo',
  },
  amount: {
    fontFamily: 'Source-Sans-Pro-Bold',
    fontSize: 20,
  },
  moreInfo: {
    width: '100%',
  }
});

export default OrderItem;

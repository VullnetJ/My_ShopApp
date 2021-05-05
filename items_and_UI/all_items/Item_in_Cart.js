import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../custom_colors/Colors';
import { TouchableOpacity,StyleSheet,View,Platform,Text} from 'react-native';

const CartItem = props => {
  return (
    <View style={styles.Item_in_cart}>
      <View style={styles.data}>
        <Text style={styles.amount}>{props.quantity} </Text>
        <Text style={styles.text}>{props.title}</Text>
      </View>
      <View style={styles.data}>
        <Text style={styles.text}>${props.amount.toFixed(2)}</Text>
        {props.deletable && (
          <TouchableOpacity
            onPress={props.onRemove}
            style={styles.delBtn}
          >
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Item_in_cart: {
    marginHorizontal: 24,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'lightseagreen',
    padding: 18,
    backgroundColor: 'lavenderblush',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  data: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  amount: {
    fontSize: 24,
    fontFamily: 'Source-Sans-Pro-Bold',
    color: 'orangered',
    
  },
  delBtn: {
    marginLeft: 24
  },
  text: {
    color: Colors.fourth,
    fontFamily: 'Source-Sans-Pro-Bold',
    fontSize: 24,
  },
});

export default CartItem;

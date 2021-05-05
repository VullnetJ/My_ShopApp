import React from 'react';
import Card from '../UserInterface/Card';
import {TouchableOpacity,TouchableNativeFeedback, Platform, View,StyleSheet,Image, Text,} from 'react-native';
import Colors from '../../custom_colors/Colors';

const ProductItem = props => {
  let Touchable = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    Touchable = TouchableNativeFeedback;
  } // for checking if phone is android => use TouchableNativeFeedback; 

    //useForeground adds a ripple effect to the foreground of the view, instead of the background. 

  return (
    <Card style={styles.card_product}>
      <View style={styles.touchable}>
        <Touchable onPress={props.onSelect} useForeground> 
          <View>
            <View style={styles.photo}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{props.title}</Text>
              <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
              {props.children}
            </View>
          </View>
        </Touchable>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card_product: {
    margin: 20,
    height: 300,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  photo: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: '60%',
    width: '100%',
    overflow: 'hidden'
  },
  image: {
    height: '100%',
    width: '100%',
  },
  details: {
    alignItems: 'center',
    height: '19%',
    padding: 9,
  },
  name: {
    fontFamily: 'Source-Sans-Pro-Bold',
    fontSize: 22,
    color: 'darkblue',
    marginVertical: 1
  },
  price: {
    color: Colors.second,
    fontFamily: 'Source-Sans-Pro-BoldItalic',
    fontSize: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '21%',
    paddingHorizontal: 20,
  }
});

export default ProductItem;

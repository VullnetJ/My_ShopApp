import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {StyleSheet, ScrollView, View, Button,  Image, Text } from 'react-native';
import * as cartActions from '../../store/redux_actions/cart';
import Colors from '../../custom_colors/Colors';


// the view where where are displaed more info for the product. 
const DetailView = props => {
  const productId = props.navigation.getParam('productId');
  const chosenProd = useSelector(state =>
    state.products.currentProductsAvailable.find(prod => prod.id === productId)
  );
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.photo} source={{ uri: chosenProd.photo_link }} />
      <View style={styles.view}>
        <Button
          title="Add to Cart"
          color={Colors.first}
          onPress={() => {
            dispatch(cartActions.addToCart(chosenProd));
          }}
        />
      </View>
      <Text style={styles.price}>${chosenProd.price.toFixed(2)}</Text>
      <Text style={styles.desc}>{chosenProd.desc}</Text>
    </ScrollView>
  );
};

DetailView.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('pTitle'),
    headerStyle: {
      backgroundColor: 'lightskyblue',
      },
    headerTintColor: 'orangered',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 22,
    },
  };
};

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: 350
  },
  view: {
    alignItems: 'center',
    marginVertical: 8,
  },
  price: {
    color: 'orangered',
    fontSize: 24,
    fontFamily: 'Source-Sans-Pro-Bold',
    textAlign: 'center',
    marginVertical: 8,
    
  },
  desc: {
    textAlign: 'center',
    fontFamily: 'Source-Sans-Pro-Italic',
    fontSize: 18,
    marginHorizontal: 20,
    color: 'navy',
  }
});

export default DetailView;

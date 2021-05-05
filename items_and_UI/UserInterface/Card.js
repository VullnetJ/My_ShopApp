import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
  return <View style={{...styles.card, ...props.style}}>{props.children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'sandybrown',
    shadowColor: 'coral', 
    shadowOpacity: 0.5,                     // works for ios only 
    shadowOffset: { width: 2, height: 7 },  // works for ios only 
    shadowRadius: 28,                       // works for ios only 
    elevation: 7,
    borderRadius: 12,                 
  }
});

export default Card;

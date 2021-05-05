import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import * as authActions from '../store/redux_actions/authentication';
import {StyleSheet, View, ActivityIndicator, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../custom_colors/Colors';

// Display the first screen to the user where either can sing in or sing up. 
// it the user has an account then authenticate. 
const FirstScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        props.navigation.navigate('Authentication');
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate('Authentication');
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();

      props.navigation.navigate('Shop');
      dispatch(authActions.authenticate(userId, token, expirationTime));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.first} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FirstScreen;
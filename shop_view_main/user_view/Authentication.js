import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {StyleSheet,ScrollView, View, KeyboardAvoidingView, Button, Alert, ActivityIndicator,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import InputHandler from '../../items_and_UI/UserInterface/InputHandler';
import Card from '../../items_and_UI/UserInterface/Card';
import Colors from '../../custom_colors/Colors';
import * as authActions from '../../store/redux_actions/authentication';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
 
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const Authentication = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error has happened!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const handlingAuthentication = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.signin(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate('Shop')
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handlingInputChange = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

    //keyboardVerticalOffset the distance between the top user screen and the react native view, 
    
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={46} style={styles.wrapper} >
      <LinearGradient colors={['#34e89e', '#0f3443']} style={styles.linear}>
        <Card style={styles.card}>
          <ScrollView>
            <InputHandler
              id="email"
              label="Enter E-mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Email address is not valid, please enter a valid email address!"
              onInputChange={handlingInputChange}
              initialValue=""
            />
            <InputHandler
              id="password"
              label="Enter Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Password is not valid, please enter a valid password!"
              onInputChange={handlingInputChange}
              initialValue=""
            />
            <View style={styles.sing}>
              {isLoading ? (
                <ActivityIndicator size="large" color={Colors.first} />
              ) : (
                <Button
                  title={isSignup ? 'Sign Up' : 'Sign In'}
                  color={Colors.sixth}
                  onPress={handlingAuthentication}
                />
              )}
            </View>
            <View style={styles.singing}>
              <Button
                title={`Change to: ${isSignup ? 'Sign In' : 'Sign Up'}`}
                color={Colors.sixth}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

Authentication.navigationOptions = {
  headerTitle: 'Sign In or Sign Up',
  headerStyle: {
  backgroundColor: 'tomato',
  },
  headerTintColor: 'blue',
  headerTitleStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    
  },
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  linear: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    padding: 30,
    backgroundColor: 'paleturquoise',
    width: '85%',
    maxWidth: 450,
    maxHeight: 450,
 
  },
  singing: {
    backgroundColor: 'peachpuff',
    marginTop: 20,
    marginLeft: 22,
    marginRight: 20,
    borderRadius: 7,
  },
});

export default Authentication;

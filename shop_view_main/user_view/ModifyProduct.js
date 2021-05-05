import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { ScrollView, Alert,ActivityIndicator, View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import Colors from '../../custom_colors/Colors';
import {Item, HeaderButtons, } from 'react-navigation-header-buttons';
import {useSelector, useDispatch, } from 'react-redux';

import HeaderButton from '../../items_and_UI/UserInterface/HeaderButton';
import * as productsActions from '../../store/redux_actions/products';
import InputHandler from '../../items_and_UI/UserInterface/InputHandler';

// validating what the user enters is needed to validate every key stroke. 
// the input is not only saved but also validated and managed the validity of input in the state. 
//

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const validitiesUpdated = {
      ...state.inputValidities,
      [action.input]: action.isValid 
    };
    let validFormUpdated = true;
    for (const key in validitiesUpdated) {
      validFormUpdated = validFormUpdated && validitiesUpdated[key];
    }
    return {
      formIsValid: validFormUpdated,
      inputValidities: validitiesUpdated,
      inputValues: updatedValues
    };
  }
  return state;
};

const ModifyProduct = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const prodId = props.navigation.getParam('productId');
  const modifiedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: modifiedProduct ? modifiedProduct.title : '',
      photo_link: modifiedProduct ? modifiedProduct.photo_link : '',
      desc: modifiedProduct ? modifiedProduct.desc : '',
      price: ''
    },
    inputValidities: {
      title: modifiedProduct ? true : false,
      photo_link: modifiedProduct ? true : false,
      desc: modifiedProduct ? true : false,
      price: modifiedProduct ? true : false
    },
    formIsValid: modifiedProduct ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Something went wrong!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Check that you have put information correctly', 'Please check the errors', [
        { text: 'Okay' }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (modifiedProduct) {
        await dispatch(
          productsActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.desc,
            formState.inputValues.photo_link
          )
        );
      } else {
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.desc,
            formState.inputValues.photo_link,
            +formState.inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
    
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.first} />
      </View>
    );
  }
// onInputchange is a listener that the function handlingInputChange fires for every key stroke. 
//based on which input is trigered is forwared to the reducer, which is required to update the state correctly. 
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <InputHandler
            id="title"
            label="Product name"
            errorText="Please enter a valid name for the product!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={handlingInputChange}
            initialValue={modifiedProduct ? modifiedProduct.title : ''}
            initiallyValid={!!modifiedProduct}
            required
          />
          <InputHandler
            id="photo_link"
            label="Photo link"
            errorText="Link for the photo is wrong, please enter a valid link!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={handlingInputChange}
            initialValue={modifiedProduct ? modifiedProduct.photo_link : ''}
            initiallyValid={!!modifiedProduct}
            required
          />
          {modifiedProduct ? null : (
            <InputHandler
              id="price"
              label="Price"
              errorText="Price is not valid, please enter a valid price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={handlingInputChange}
              required
              min={0.1}
            />
          )}
          <InputHandler
            id="desc"
            label="Description"
            errorText="Please check that description is not too short, or invalid!"
            keyboardType="default"
            autoCapitalize="sentences"
            multiline
            autoCorrect
            numberOfLines={3}
            onInputChange={handlingInputChange}
            initialValue={modifiedProduct ? modifiedProduct.desc : ''}
            initiallyValid={!!modifiedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

ModifyProduct.navigationOptions = navData => {
  const handleSubmit = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Modify your product'
      : 'Add a new product',
      headerStyle: {
        backgroundColor: 'plum',
        },
        headerTintColor: 'blue',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22,
        },
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        iconSize={23}
        <Item
          title="Save"
          iconName={
            Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'
          }
          onPress={handleSubmit}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default ModifyProduct;

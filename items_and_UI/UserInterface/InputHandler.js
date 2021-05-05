import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const MODIFYING_INPUT = 'MODIFYING_INPUT';
const BLURING_INPUT = 'BLURING_INPUT';

const inputReducer = (state, action) => {
  switch (action.type) {
    case MODIFYING_INPUT:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case BLURING_INPUT:
      return {
        ...state,
        touched: true
      };
    default:
      return state;
  }
};

const InputHandler = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: false
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const handlingTextChange = text => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({ type: MODIFYING_INPUT, value: text, isValid: isValid });
  };

  const handlingLostFocus = () => {
    dispatch({ type: BLURING_INPUT });
  };

  return (
    <View style={styles.View}>
      <Text style={styles.text}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.txt}
        value={inputState.value}
        onChangeText={handlingTextChange}
        onBlur={handlingLostFocus}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.err}>
          <Text style={styles.errTxt}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  View: {
    width: '100%'
  },
  text: {
    color: 'darkmagenta',
    fontFamily: 'Source-Sans-Pro-SemiBold',
    fontSize: 20,
    marginVertical: 8,
    textAlign: 'center',
   
  },
  txt: {
    borderBottomColor: 'darkviolet',
    borderBottomWidth: 2,
    paddingHorizontal: 2,
    paddingVertical: 6,
    textAlign: 'center',
  },
  err: {
    marginVertical: 5
  },
  errTxt: {
    fontFamily: 'Source-Sans-Pro-Italic',
    color: 'coral',
    fontSize: 15,
    textAlign: 'center',
  }
});

export default InputHandler;

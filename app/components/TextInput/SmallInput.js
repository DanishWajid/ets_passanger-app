import React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';

const SmallInput = props => (
  <TextInput
    style={styles.smallInput}
    underlineColorAndroid="#878787"
    {...props}
  />
);

export default SmallInput;

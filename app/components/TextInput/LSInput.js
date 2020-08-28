import React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';

const LSInput = props => (
  <TextInput
    style={styles.lsInput}
    underlineColorAndroid="#878787"
    {...props}
  />
);

export default LSInput;

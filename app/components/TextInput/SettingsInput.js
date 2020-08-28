import React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';

const SettingsInput = props => (
  <TextInput
    style={styles.SettingsInput}
    underlineColorAndroid="transparent"
    {...props}
  />
);

export default SettingsInput;

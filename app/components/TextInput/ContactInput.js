import React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';

const ContactInput = props => (
  <TextInput
    style={styles.ContactInput}
    underlineColorAndroid="transparent"
    {...props}
  />
);

export default ContactInput;

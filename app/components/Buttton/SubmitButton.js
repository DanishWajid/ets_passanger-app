import React from 'react';
import {Button} from 'react-native-elements';
import styles from './styles';

const SubmitButton = props => (
  <Button
    buttonStyle={styles.submitButton}
    titleStyle={{fontWeight: '700'}}
    {...props}
  />
);

export default SubmitButton;

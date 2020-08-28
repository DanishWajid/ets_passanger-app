import React from 'react';
import {Button} from 'react-native-elements';
import styles from './styles';

const UpdateButton = props => (
  <Button
    buttonStyle={styles.updateButton}
    titleStyle={{fontWeight: '700'}}
    {...props}
  />
);

export default UpdateButton;

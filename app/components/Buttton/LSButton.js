import React from 'react';
import {Button} from 'react-native-elements';
import styles from './styles';

const LSButton = props => (
  <Button
    buttonStyle={styles.lsButton}
    titleStyle={{fontWeight: '700'}}
    {...props}
  />
);

export default LSButton;

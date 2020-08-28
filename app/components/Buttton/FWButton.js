import React from 'react';
import {Button} from 'react-native-elements';
import styles from './styles';

const FWButton = props => (
  <Button
    buttonStyle={styles.fwButton}
    titleStyle={{fontWeight: '700'}}
    {...props}
  />
);

export default FWButton;

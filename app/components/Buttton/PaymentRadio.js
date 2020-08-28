import React from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import styles from './styles';

const PaymentRadio = ({text1, text2, onSelect, disabled}) => (
  <RadioGroup
    thickness={3}
    color="#EA2141"
    selectedIndex={0}
    onSelect={onSelect}
  >
    <RadioButton disabled={disabled} value="Cash">
      <Text style={styles.darktext}>{text1}</Text>
    </RadioButton>

    <RadioButton disabled={disabled} value="Card">
      <Text style={styles.darktext}>{text2}</Text>
    </RadioButton>

  </RadioGroup>
);
PaymentRadio.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
};

export default PaymentRadio;

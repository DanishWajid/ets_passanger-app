import React from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import styles from './styles';

const Radio = ({text1, text2, onSelect}) => (
  <RadioGroup
    size={22}
    thickness={3}
    color="#EA2141"
    selectedIndex={0}
    style={styles.container}
    onSelect={onSelect}
  >
    <RadioButton value="item1" style={styles.radioButton}>
      <Text style={styles.text}>{text1}</Text>
    </RadioButton>

    <RadioButton value="item2" style={styles.radioButton}>
      <Text style={styles.text}>{text2}</Text>
    </RadioButton>

  </RadioGroup>
);
Radio.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
  onSelect: PropTypes.func,
};

export default Radio;

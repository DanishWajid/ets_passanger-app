import React from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import styles from './styles';

const GenderRadio = ({text1, text2, text3, onSelect}) => (
  <RadioGroup
    // size={22}
    thickness={3}
    color="#EA2141"
    selectedIndex={0}
    onSelect={onSelect}
  >
    <RadioButton value="Female">
      <Text style={styles.darktext}>{text1}</Text>
    </RadioButton>

    <RadioButton value="Male">
      <Text style={styles.darktext}>{text2}</Text>
    </RadioButton>

    <RadioButton value="Prefer not to specify">
      <Text style={styles.darktext}>{text3}</Text>
    </RadioButton>
  </RadioGroup>
);
GenderRadio.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  onSelect: PropTypes.func,
};

export default GenderRadio;

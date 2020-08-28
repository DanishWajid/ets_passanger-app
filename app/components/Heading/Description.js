import PropTypes from 'prop-types';
import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const Description = ({ text }) => (
  <View>
    <Text style={styles.Description}>
      {text}
    </Text>
  </View>
);

Description.propTypes = {
  text: PropTypes.string,
};

export default Description;

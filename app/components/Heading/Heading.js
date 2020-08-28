import PropTypes from 'prop-types';
import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const Heading = ({ text }) => (
  <View>
    <Text style={styles.Heading}>
      {text}
    </Text>
  </View>
);

Heading.propTypes = {
  text: PropTypes.string,
};

export default Heading;

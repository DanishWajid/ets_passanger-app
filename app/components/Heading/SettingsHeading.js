import PropTypes from 'prop-types';
import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const SettingsHeading = ({ text }) => (
  <View>
    <Text style={styles.SettingsHeading}>
      {text}
    </Text>
  </View>
);

SettingsHeading.propTypes = {
  text: PropTypes.string,
};

export default SettingsHeading;

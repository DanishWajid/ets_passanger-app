import PropTypes from 'prop-types';
import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const SettingsDescription = ({ text }) => (
  <View>
    <Text style={styles.SettingsDescription}>
      {text}
    </Text>
  </View>
);

SettingsDescription.propTypes = {
  text: PropTypes.string,
};

export default SettingsDescription;

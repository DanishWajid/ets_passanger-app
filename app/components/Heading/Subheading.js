import PropTypes from 'prop-types';
import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import styles from './styles';

const Subheading = ({text}) => (
  <View>
    <Text style={styles.Subheading}>
      {text}
    </Text>
  </View>
);

Subheading.propTypes = {
  text: PropTypes.string,
};

export default Subheading;

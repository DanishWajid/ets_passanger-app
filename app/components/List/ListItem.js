import PropTypes from 'prop-types';
import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {Icon} from 'native-base';
import Separator from './Seperator';
import styles from './styles';

const ListItem = ({onPress, date, fare, pickup, destination}) => (
  <View>
    <TouchableHighlight underlayColor="rgba(215, 219, 221,1)" onPress={onPress}>
      <View>
        <View style={styles.row}>
          <View style={styles.topRow}>

            <Text style={styles.heading}>
              {date}
            </Text>
            <Text style={styles.heading}>
              {fare}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.bottomRow}>
            <Icon name="radio-button-off" style={styles.icon} />
            <Text style={styles.stops}>
              {pickup}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <Icon name="pin" style={styles.icon} />
            <Text style={styles.stops}>
              {destination}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
    <Separator />
  </View>
);

ListItem.propTypes = {
  date: PropTypes.string,
  fare: PropTypes.any,
  pickup: PropTypes.string,
  destination: PropTypes.string,
  onPress: PropTypes.func,
};

export default ListItem;

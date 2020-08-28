import React from 'react';
import {View, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Right, Icon, Content} from 'native-base';
import styles from './styles';
import {Separator} from '../List';

const AllDropdown = props => (
  <TouchableHighlight
    style={styles.mainCont}
    onPress={props.onPress}
    underlayColor="rgba(215, 219, 221,0)"
  >
    <Content>
      <View style={styles.outerContainer}>
        <View>

          <Text style={styles.mainText}>{props.leftText}</Text>

        </View>
        <Right>
          <View style={styles.container}>
            <Text style={styles.iconText}>{props.rightText}</Text>
            <Icon name={props.iconName} style={styles.dropIcon} />
          </View>
        </Right>

      </View>
      <Separator />
    </Content>
  </TouchableHighlight>
);

AllDropdown.propTypes = {
  rightText: PropTypes.string,
  leftText: PropTypes.string,
  iconName: PropTypes.string,
  onPress: PropTypes.func,
};

export default AllDropdown;

import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Right, Content} from 'native-base';
import styles from './styles';

class DateTime extends Component {
  render () {
    return (
      <Content style={styles.dropContainer}>
        <View style={styles.dateContainer}>
          <View>

            <Text style={styles.dateTimeText}>Date</Text>

          </View>
          <Right>
            <Text style={styles.dateTimeText}>
              {this.props.date}
            </Text>

          </Right>

        </View>
        <View style={styles.timeContainer}>
          <View>

            <Text style={styles.dateTimeText}>Time</Text>

          </View>
          <Right>
            <Text style={styles.dateTimeText}>
              {this.props.time}
            </Text>

          </Right>

        </View>

      </Content>
    );
  }
}
DateTime.propTypes = {
  date: PropTypes.string,
  time: PropTypes.string,
};

export default DateTime;

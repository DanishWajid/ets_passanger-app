import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from './styles';

class Time extends Component {
  constructor (props) {
    super (props);
    this.state = {timeValue: 'Select'};
  }

  state = {
    isDateTimePickerVisible: false,
  };

  showDateTimePicker = () => this.setState ({isDateTimePickerVisible: true});

  hideDateTimePicker = () => this.setState ({isDateTimePickerVisible: false});

  timeConversion (time) {
    let TimeType;
    let hour = time.toString ().slice (15, 18);
    const minutes = time.toString ().slice (19, 21);

    if (hour <= 11) {
      TimeType = 'AM';
      hour = hour.slice (-1);
    } else {
      TimeType = 'PM';
    }

    if (hour > 12) {
      hour -= 12;
    }

    if (hour === 0) {
      hour = 12;
    }
    return `${hour.toString ()}:${minutes.toString ()} ${TimeType.toString ()}`;
  }

  handleDatePicked = time => {
    this.state.timeValue = this.timeConversion (time).toString ();
    this.props.callbackFromParent (time.toString ().slice (16, 24));
    this.hideDateTimePicker ();
  };

  render () {
    return (
      <View style={styles.dateContainer}>

        <Icon name="time" style={styles.icon} />
        <Text style={styles.text}>Time</Text>

        <View style={styles.dateBar}>
          <TouchableOpacity onPress={this.showDateTimePicker}>
            <Text style={styles.pickerText}>{this.state.timeValue}</Text>
          </TouchableOpacity>
          <DateTimePicker
            titleStyle={styles.time}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="time"
            is24Hour={false}
          />
        </View>
      </View>
    );
  }
}

Time.propTypes = {
  callbackFromParent: PropTypes.func,
};
export default Time;

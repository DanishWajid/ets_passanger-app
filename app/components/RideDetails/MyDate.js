import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from './styles';

class MyDate extends Component {
  constructor (props) {
    super (props);
    this.state = {dateValue: 'Select'};
  }

  state = {
    isDateTimePickerVisible: false,
  };

  showDateTimePicker = () => this.setState ({isDateTimePickerVisible: true});

  hideDateTimePicker = () => this.setState ({isDateTimePickerVisible: false});

  dateConversion (date) {
    const day = date.toString ().slice (5, 7);
    const month = date.toString ().slice (1, 4);
    const year = date.toString ().slice (8, 12);

    return `${`${day.toString ()} `}${`${month.toString ()},`} ${year.toString ()}`;
  }

  handleDatePicked = date => {
    this.props.callbackFromParent (
      this.dateConversion (date.toString ().slice (3, 15)).toString ()
    );
    this.state.dateValue = date.toString ().slice (3, 11);
    this.hideDateTimePicker ();
  };

  render () {
    return (
      <View style={styles.dateContainer}>

        <Icon name="calendar" style={styles.icon} />
        <Text style={styles.text}>Date</Text>

        <View style={styles.dateBar}>
          <TouchableOpacity onPress={this.showDateTimePicker}>
            <Text style={styles.pickerText}>{this.state.dateValue}</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="date"
          />
        </View>
      </View>
    );
  }
}

MyDate.propTypes = {
  callbackFromParent: PropTypes.func,
};

export default MyDate;

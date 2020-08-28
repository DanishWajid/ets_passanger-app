import React, {Component} from 'react';
import {View, Text, Picker} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

class ContactReason extends Component {
  static propTypes = {
    callbackFromParent: PropTypes.func,
  };

  constructor (props) {
    super (props);

    this.state = {
      ReasonValue: 'Complaint',
    };
  }

  Reason = data => {
    this.setState ({ReasonValue: data});
    this.props.callbackFromParent (data);
  };

  render () {
    return (
      <View style={styles.passangerContainer}>
        <View style={styles.passangerInnercontainer}>
          <View style={styles.dateContainer}>

            <Text style={styles.text}>Contact Reason</Text>

            <View style={styles.PassengerBar}>
              <Picker
                selectedValue={this.state.ReasonValue}
                mode="dropdown"
                style={styles.contactDropdown}
                onValueChange={itemValue => this.Reason (itemValue)}
              >
                <Picker.Item label="Complaint" value="Complaint" />
                <Picker.Item label="Lost Item" value="Lost Item" />
                <Picker.Item label="Enquiry" value="Enquiry" />

              </Picker>
            </View>
          </View>
        </View>

      </View>
    );
  }
}
export default ContactReason;

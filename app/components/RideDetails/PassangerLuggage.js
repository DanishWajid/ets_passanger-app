import React, {Component} from 'react';
import {View, Text, Picker} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
import styles from './styles';

class PassangerLuggage extends Component {
  constructor (props) {
    super (props);

    this.state = {
      passangersValue: 1,
      LuggageValue: 1,
    };
  }

  Luggage = data => {
    this.setState ({LuggageValue: data});
    this.props.luggagecallbackFromParent (data);
  };

  Passanger = data => {
    this.setState ({passangersValue: data});
    this.props.passangercallbackFromParent (data);
  };

  render () {
    return (
      <View style={styles.passangerContainer}>
        <View style={styles.passangerInnercontainer}>
          <View style={styles.dateContainer}>

            <Icon name="people" style={styles.icon} />
            <Text style={styles.text}>Passengers</Text>

            <View style={styles.PassengerBar}>
              <Picker
                selectedValue={this.state.passangersValue}
                mode="dropdown"
                style={styles.passangerDropdown}
                onValueChange={itemValue => this.Passanger (itemValue)}
              >
                <Picker.Item label="1 Person" value={1} />
                <Picker.Item label="2 Persons" value={2} />
                <Picker.Item label="3 Persons" value={3} />
                <Picker.Item label="4 Persons" value={4} />
                <Picker.Item label="5 Persons" value={5} />
                <Picker.Item label="6 Persons" value={6} />
                <Picker.Item label="7 Persons" value={7} />
                <Picker.Item label="8 Persons" value={8} />
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.passangerInnercontainer}>
          <View style={styles.dateContainer}>

            <Icon name="briefcase" style={styles.icon} />
            <Text style={styles.text}>Luggage</Text>

            <View style={styles.LuggageBar}>
              <Picker
                selectedValue={this.state.LuggageValue}
                mode="dropdown"
                style={styles.luggageDropdown}
                onValueChange={itemValue => this.Luggage (itemValue)}
              >
                <Picker.Item label="1 Item" value={1} />
                <Picker.Item label="2 Items" value={2} />
                <Picker.Item label="3 Items" value={3} />
                <Picker.Item label="4 Items" value={4} />
                <Picker.Item label="5 Items" value={5} />
                <Picker.Item label="6 Items" value={6} />
                <Picker.Item label="7 Items" value={7} />
                <Picker.Item label="8 Items" value={8} />
              </Picker>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

PassangerLuggage.propTypes = {
  luggagecallbackFromParent: PropTypes.func,
  passangercallbackFromParent: PropTypes.func,
};
export default PassangerLuggage;

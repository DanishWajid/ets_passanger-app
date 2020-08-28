import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
import styles from './styles';

class IosPassangerLuggage extends Component {
  constructor (props) {
    super (props);

    this.state = {
      passengerInputValue: '1 Person',
      luggageInputValue: '1 Item',
    };
  }

  Luggage = data => {
    this.props.luggagecallbackFromParent (data);
  };

  Passanger = data => {
    this.props.passangercallbackFromParent (data);
  };

  render () {
    const passengersData = [
      {key: 0, section: true, label: 'Passengers'},
      {key: 1, label: '1 Person'},
      {key: 2, label: '2 Persons'},
      {key: 3, label: '3 Persons'},
      {key: 4, label: '4 Persons'},
      {key: 5, label: '5 Persons'},
    ];
    const luggageData = [
      {key: 0, section: true, label: 'Luggage'},
      {key: 1, label: '1 Item'},
      {key: 2, label: '2 Items'},
      {key: 3, label: '3 Items'},
      {key: 4, label: '4 Items'},
      {key: 5, label: '5 Items'},
    ];

    return (
      <View style={styles.passangerContainer}>
        <View style={styles.passangerInnercontainer}>
          <View style={styles.dateContainer}>

            <Icon name="people" style={styles.iosIcon} />
            <Text style={styles.text}>Passengers</Text>

            <ModalSelector
              data={passengersData}
              initValue="1 Person"
              accessible
              scrollViewAccessibilityLabel="Scrollable options"
              cancelButtonAccessibilityLabel="Cancel Button"
              onChange={option => {
                this.setState ({passengerInputValue: option.label});
                this.Passanger (option.key);
              }}
            >

              <TextInput
                style={{
                  backgroundColor: 'white',
                  paddingHorizontal: '20%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  width: '75%',
                  height: '86%',
                  marginLeft: '9%',
                  borderRadius: 20,
                  justifyContent: 'center',
                  shadowColor: 'grey',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.5,
                  shadowRadius: 1,

                  elevation: 1,
                }}
                editable={false}
                placeholder="1 Person"
                placeholderTextColor="black"
                value={this.state.passengerInputValue}
              />

            </ModalSelector>
          </View>
        </View>
        <View style={styles.passangerInnercontainer}>
          <View style={styles.dateContainer}>

            <Icon name="briefcase" style={styles.iosIcon} />
            <Text style={styles.text}>Luggage</Text>

            <ModalSelector
              data={luggageData}
              initValue="1 Item"
              accessible
              scrollViewAccessibilityLabel="Scrollable options"
              cancelButtonAccessibilityLabel="Cancel Button"
              onChange={option => {
                this.setState ({luggageInputValue: option.label});
                this.Luggage (option.key);
              }}
            >

              <TextInput
                style={{
                  backgroundColor: 'white',
                  paddingHorizontal: '20%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  width: '66%',
                  height: '86%',
                  marginLeft: '20%',
                  borderRadius: 20,
                  justifyContent: 'center',
                  shadowColor: 'grey',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.5,
                  shadowRadius: 1,

                  elevation: 1,
                }}
                editable={false}
                placeholder="1 Item"
                placeholderTextColor="black"
                value={this.state.luggageInputValue}
              />

            </ModalSelector>
          </View>
        </View>
      </View>
    );
  }
}

IosPassangerLuggage.propTypes = {
  luggagecallbackFromParent: PropTypes.func,
  passangercallbackFromParent: PropTypes.func,
};
export default IosPassangerLuggage;

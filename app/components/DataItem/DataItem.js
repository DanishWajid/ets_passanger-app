import React from 'react';
import {TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import {View, Icon} from 'native-base';
import {Heading, Subheading, Description} from '../Heading';
import styles from './styles';
import {Separator} from '../List';

const DataItem = ({
  name,
  Mnumber,
  email,
  gender,
  dob,
  onNamePress,
  onNumberPress,
  onEmailPress,
  onPasswordPress,
  onGenderPress,
  onDOBPress,
  onRatePress,
}) => (
  <View style={styles.container}>
    <View>
      <Heading text="Profile" />
      <TouchableHighlight
        onPress={onNamePress}
        underlayColor="rgba(215, 219, 221,1)"
      >
        <View style={styles.row}>
          <Icon name="ios-contact" style={styles.icon} />
          <View style={styles.details}>
            <Subheading text="Name" />
            <Description text={name} />
          </View>
        </View>
      </TouchableHighlight>
      {/* <TouchableHighlight
        onPress={onNumberPress}
        underlayColor="rgba(208, 211, 212,1)"
      >
        <View style={styles.row}>
          <Icon name="ios-phone-portrait" style={styles.icon} />
          <View style={styles.details}>
            <Subheading text="Mobile Number" />
            <Description text={Mnumber} />
          </View>
        </View>
      </TouchableHighlight> */}
      <TouchableHighlight
        onPress={onEmailPress}
        underlayColor="rgba(215, 219, 221,1)"
      >
        <View style={styles.row}>
          <Icon name="ios-mail" style={styles.icon} />
          <View style={styles.details}>
            <Subheading text="Email" />
            <Description text={email} />
          </View>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={onPasswordPress}
        underlayColor="rgba(215, 219, 221,1)"
      >
        <View style={styles.row}>
          <Icon name="ios-lock" style={styles.icon} />
          <View style={styles.details}>
            <Subheading text="Change Password" />

          </View>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={onGenderPress}
        underlayColor="rgba(215, 219, 221,1)"
      >
        <View style={styles.row}>
          <Icon name="ios-person" style={styles.icon} />
          <View style={styles.details}>
            <Subheading text="Gender" />
            <Description text={gender} />

          </View>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={onDOBPress}
        underlayColor="rgba(215, 219, 221,1)"
      >
        <View style={styles.row}>
          <Icon name="ios-calendar" style={styles.icon} />
          <View style={styles.details}>
            <Subheading text="Date of Birth" />
            <Description text={dob} />

          </View>
        </View>
      </TouchableHighlight>

      <Separator />
    </View>
    <View>
      <Heading text="General" />
      <TouchableHighlight
        onPress={onRatePress}
        underlayColor="rgba(215, 219, 221,1)"
      >
        <View style={styles.row}>
          <Icon name="star" style={styles.icon} />
          <View style={styles.details}>
            <Subheading text="Rate the App" />

          </View>
        </View>
      </TouchableHighlight>

    </View>
  </View>
);

DataItem.propTypes = {
  name: PropTypes.string,
  // Mnumber: PropTypes.string,
  email: PropTypes.any,
  gender: PropTypes.string,
  dob: PropTypes.string,
  onNamePress: PropTypes.func,
  onNumberPress: PropTypes.func,
  onEmailPress: PropTypes.func,
  onPasswordPress: PropTypes.func,
  onGenderPress: PropTypes.func,
  onDOBPress: PropTypes.func,
  onRatePress: PropTypes.func,
};

export default DataItem;

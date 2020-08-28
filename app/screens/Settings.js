import React, {Component} from 'react';
import {StatusBar, ScrollView, Platform, Linking} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {DataItem} from '../components/DataItem';
import {CustomHeader} from '../components/CustomHeader';
import {EtsContainer} from '../components/Container';
import {updateUser} from '../actions/login';
import * as moment from 'moment';

let Ref = '';

class Rides extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor (props) {
    super (props);
    this.state = {isLoaded: false};
  }

  componentWillMount () {
    if (this.props.currentUser !== null) {
      this.setState ({isLoaded: true});
      if (this.props.currentUser.dateOfBirth !== 'Select your date of birth') {
        this.props.currentUser.dateOfBirth = moment
          .utc (this.props.currentUser.dateOfBirth, 'hmm')
          .format ('YYYY-MM-DD')
          .toString ();
      }
    }
  }

  state = {
    isDateTimePickerVisible: false,
  };

  showDateTimePicker = () => this.setState ({isDateTimePickerVisible: true});

  hideDateTimePicker = () => this.setState ({isDateTimePickerVisible: false});

  handleDatePicked = date => {
    const db = firebase.firestore ();
    const batch = db.batch ();
    firebase.auth ().onAuthStateChanged (user => {
      if (user) {
        Ref = db.collection ('users').doc (firebase.auth ().currentUser.uid);

        batch.update (Ref, {dateOfBirth: date});
        this.props.currentUser.dateOfBirth = moment
          .utc (date, 'hmm')
          .format ('YYYY-MM-DD')
          .toString ();
        const currentUser = this.props.currentUser;
        this.props.dispatch (updateUser (currentUser));

        batch.commit ();
        this.refresh ();
        this.hideDateTimePicker ();
      }
    });
  };

  refresh () {
    this.forceUpdate ();
  }

  handlePressName = () => {
    this.props.navigation.navigate ('Name', {
      onGoBack: () => this.refresh (),
    });
  };

  handlePressNumber = () => {
    this.props.navigation.navigate ('MobileNumber', {
      onGoBack: () => this.refresh (),
    });
  };

  handlePressEmail = () => {
    this.props.navigation.navigate ('Email', {
      onGoBack: () => this.refresh (),
    });
  };

  handlePressGender = () => {
    this.props.navigation.navigate ('Gender', {
      onGoBack: () => this.refresh (),
    });
  };

  handlePressPassword = () => {
    this.props.navigation.navigate ('Password', {
      onGoBack: () => this.refresh (),
    });
  };

  handlePressRate = () => {
    if (Platform.OS === 'android') {
      Linking.openURL (
        'https://play.google.com/store/apps/details?id=com.etscars.etspassenger'
      );
    } else if (Platform.OS === 'ios') {
      Linking.openURL ('https://www.apple.com/lae/');
    }
  };

  render () {
    if (this.state.isLoaded) {
      return (
        <EtsContainer>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="red"
            translucent={false}
          />
          <CustomHeader
            title="Settings"
            drawerOpen={() => this.props.navigation.openDrawer ()}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <DataItem
              name={`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}
              // Mnumber={this.props.currentUser.firebaseData.phoneNumber}
              email={this.props.currentUser.email}
              gender={this.props.currentUser.gender}
              dob={this.props.currentUser.dateOfBirth}
              onNamePress={this.handlePressName}
              onNumberPress={this.handlePressNumber}
              onEmailPress={this.handlePressEmail}
              onPasswordPress={this.handlePressPassword}
              onGenderPress={this.handlePressGender}
              onDOBPress={this.showDateTimePicker}
              onRatePress={this.handlePressRate}
            />
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode="date"
            />
          </ScrollView>
        </EtsContainer>
      );
    }
    return (
      <View style={{flex: 1}}>
        <Spinner visible={!this.state.isLoaded} size="large" animation="fade" />
      </View>
    );
  }
}
const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (Rides);

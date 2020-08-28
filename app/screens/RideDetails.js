import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Content} from 'native-base';
import {connect} from 'react-redux';
import {ImageBackground, ScrollView} from 'react-native';
import * as moment from 'moment';
import {isEmpty} from 'lodash';
import firebase from 'react-native-firebase';
import {CustomHeader} from '../components/CustomHeader';
import {SubmitButton} from '../components/Buttton';
import {RideSummary} from '../components/RideSummary';
import {EtsContainer} from '../components/Container';

const db = firebase.firestore ();

class RideDetails extends Component {
  static propTypes = {
    title: PropTypes.string,
    drawerOpen: PropTypes.func,
    goback: PropTypes.func,
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
  };

  submitDetails = () => {
    let {navObject = {}} = this.props.navigation.state.params || {};
    const dateTime = moment
      .utc (`${navObject.rideDate} ${navObject.rideTime}`)
      .utcOffset ('-05:00')._d;
    navObject = {
      ...navObject,
      dateTime,
      rideStatus: 1,
    };
    if (
      navObject.return &&
      navObject.rideReturnDate &&
      navObject.rideReturnTime
    ) {
      const returnDate = moment
        .utc (`${navObject.rideReturnDate} ${navObject.rideReturnTime}`)
        .utcOffset ('-05:00')._d;

      navObject = {
        ...navObject,
        returnDate,
      };
    }
    let params = {};
    for (const key in navObject) {
      if (key && navObject[key]) {
        params = {...params, [key]: navObject[key]};
      }
    }
    let {
      viaLocations,
      carId,
      passanger,
      luggage,
      drop,
      rideDate,
      rideTime,
      ...filteredParam
    } = params;
    filteredParam = {
      ...filteredParam,
      assignment: {
        assignedTo: null,
        status: 0,
      },
      dropof: drop,
      luggageItems: luggage,
      passengers: passanger,
      extraInfo: params.extraInfo.message,
      fare: parseFloat (params.fare),
      car: db.collection ('cars').doc (carId),
    };
    console.log (carId);
    if (!isEmpty (viaLocations)) {
      filteredParam = {...filteredParam, viaLocations};
    }
    this.props.navigation.navigate ('Payment', {navObject: filteredParam});
  };

  render () {
    const {navObject = {}} = this.props.navigation.state.params || {};

    return (
      <EtsContainer>
        <ImageBackground
          source={require ('../assets/caroverlay.jpg')}
          style={styles.background}
        >
          <CustomHeader
            backButton
            transparent
            title="Ride Details"
            primaryHeader={false}
            goback={() => this.props.navigation.goBack ()}
          />
          <ScrollView>
            <Content style={styles.content}>
              <RideSummary {...navObject} />
              <SubmitButton title="Confirm" onPress={this.submitDetails} />
            </Content>
          </ScrollView>
        </ImageBackground>
      </EtsContainer>
    );
  }
}

const styles = EStyleSheet.create ({
  background: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: '5%',
  },
});

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (RideDetails);

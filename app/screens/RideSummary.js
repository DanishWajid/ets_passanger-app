import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, Text} from 'native-base';
import {TouchableHighlight, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {CustomHeader} from '../components/CustomHeader';
import {
  All,
  DateTime,
  AllDropdown,
  ViasDropdown,
} from '../components/RideSummary';
import {AnotherSeparator} from '../components/List';
import {EtsContainer} from '../components/Container';

let rideTimingIcon = 'ios-arrow-down';
let rideTypeIcon = 'ios-arrow-down';
let viasIcon = 'ios-arrow-down';

class RideSummary extends Component {
  constructor (props) {
    super (props);
    this.state = {
      rideTimingStatus: false,
      rideTypeStatus: false,
      viasStatus: false,
    };
  }

  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
  };

  handleRideTiming = () => {
    if (this.state.rideTimingStatus === false) {
      this.setState ({
        rideTimingStatus: true,
      });
      rideTimingIcon = 'ios-arrow-up';
    } else {
      this.setState ({
        rideTimingStatus: false,
      });
      rideTimingIcon = 'ios-arrow-down';
    }
  };

  handleRideType = () => {
    if (this.state.rideTypeStatus === false) {
      this.setState ({
        rideTypeStatus: true,
      });
      rideTypeIcon = 'ios-arrow-up';
    } else {
      this.setState ({
        rideTypeStatus: false,
      });
      rideTypeIcon = 'ios-arrow-down';
    }
  };

  handleVias = () => {
    if (this.state.viasStatus === false) {
      this.setState ({
        viasStatus: true,
      });
      viasIcon = 'ios-arrow-up';
    } else {
      this.setState ({
        viasStatus: false,
      });
      viasIcon = 'ios-arrow-down';
    }
  };

  render () {
    const date = this.props.navigation.state.params.date;
    const time = this.props.navigation.state.params.time;
    return (
      <EtsContainer>
        <CustomHeader
          title={`${date} - ${time}`}
          goback={() => this.props.navigation.navigate ('History')}
          backButton
        />
        <ScrollView>

          <All
            address
            leftText="Pickup"
            rightText={this.props.navigation.state.params.pickup}
          />
          <All
            address
            leftText="Drop"
            rightText={this.props.navigation.state.params.drop}
          />
          <AnotherSeparator />
          <AllDropdown
            leftText="Ride timing"
            rightText=""
            onPress={this.handleRideTiming}
            iconName={rideTimingIcon}
          />
          <AnotherSeparator />
          {this.state.rideTimingStatus && <DateTime time={time} date={date} />}
          <All
            people
            leftText="Luggage"
            rightText={`${this.props.navigation.state.params.luggage}x`}
            iconName="briefcase"
          />
          <AnotherSeparator />
          <All
            people
            leftText="Passangers"
            rightText={`${this.props.navigation.state.params.passengers}x`}
            iconName="person"
          />
          {this.props.navigation.state.params.via &&
            <AllDropdown
              leftText="Vias"
              rightText=""
              onPress={this.handleVias}
              iconName={viasIcon}
            />}
          <AnotherSeparator />
          {this.state.viasStatus &&
            <ViasDropdown
              vias={this.props.navigation.state.params.viaLocations}
            />}
          <All
            address
            leftText="Ride fare"
            rightText={`£ ${this.props.navigation.state.params.fare}`}
          />
          <AnotherSeparator />
          {this.props.navigation.state.params.return &&
            <AllDropdown
              leftText="Ride type"
              rightText="Return"
              onPress={this.handleRideType}
              iconName={rideTypeIcon}
            />}
          {!this.props.navigation.state.params.return &&
            <All
              address
              leftText="Ride type"
              rightText={this.props.navigation.state.params.rideType}
            />}
          {this.state.rideTypeStatus &&
            <DateTime
              time={this.props.navigation.state.params.returnTime}
              date={this.props.navigation.state.params.returnDate}
            />}
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate ('Contact Us')}
            underlayColor="rgba(215, 219, 221,0)"
          >
            <View style={styles.txtContainer}>
              <Text style={styles.txt}>REPORT A PROBLEM</Text>
            </View>
          </TouchableHighlight>
        </ScrollView>
      </EtsContainer>
    );
  }
}

const styles = EStyleSheet.create ({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flex: 1,
  },
  txtContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 60,
  },
  txt: {
    color: '#EA2141',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RideSummary;

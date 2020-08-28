import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Content, View} from 'native-base';
import {ImageBackground, Platform} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {cloneDeep} from 'lodash';
import t from 'tcomb-form-native';
import {Vias} from '../components/Vias';
import {
  MyDate,
  Time,
  PassangerLuggage,
  IosPassangerLuggage,
} from '../components/RideDetails';
import {Radio, SubmitButton} from '../components/Buttton';
import {CustomHeader} from '../components/CustomHeader';
import {getLocationObj, myHeight, showMessage} from '../utils';
import GooglePlacesSearch
  from '../components/GooglePlacesSearch/GooglePlacesSearch';

const BORDER_RADIUS = 4;

let Stops = [];
const Form = t.form.Form;
const length = s => s.length <= 250;
const request = t.refinement (t.String, s => length (s));

const contact = t.struct ({
  message: request,
});
const stylesheet = cloneDeep (t.form.Form.stylesheet);
stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.normal.marginTop = 10;
stylesheet.textbox.normal.marginTop = 10;
stylesheet.textboxView.normal.borderWidth = 0;
stylesheet.textboxView.normal.borderColor = '#878787';
stylesheet.textbox.normal.height = 60;
stylesheet.textbox.normal.textAlignVertical = 'center';
stylesheet.textbox.normal.backgroundColor = 'white';
const options = {
  stylesheet,
  fields: {
    message: {
      auto: 'none',
      placeholder: 'Extra Information',
      multiline: true,
    },
  },
};
const defaultState = {
  via: false,
  meetGreet: false,
  ASAP: true,
  return: false,
  pickup: null,
  drop: null,
  rideType: 'One Way',
  luggage: 1,
  passanger: 1,
  rideTime: new Date ().toString ().slice (16, 24),
  rideReturnDate: '',
  rideReturnTime: '',
  extraInfo: '',
};

class Home extends Component {
  constructor (props) {
    super (props);
    this.state = {
      ...defaultState,
      rideDate: this.dateConversion (new Date ().toString ().slice (3, 15)),
    };
  }

  dateConversion (date) {
    const day = date.toString ().slice (5, 7);
    const month = date.toString ().slice (1, 4);
    const year = date.toString ().slice (8, 12);

    return `${`${day.toString ()} `}${`${month.toString ()},`} ${year.toString ()}`;
  }

  handlePressCheckedBox = () => {
    if (this.state.via === false) {
      this.setState ({
        via: true,
      });
    } else {
      this.setState ({
        via: false,
      });
    }
  };

  returnRideOnSelect = (index, value) => {
    if (index === 0 && value === 'item1') {
      this.setState ({ASAP: true});
      this.setState ({
        rideDate: this.dateConversion (new Date ().toString ().slice (3, 15)),
      });
      this.setState ({
        rideTime: new Date ().toString ().slice (16, 24),
      });
    } else {
      this.setState ({ASAP: false});
    }
  };

  futureRideOnSelect = (index, value) => {
    if (index === 0 && value === 'item1') {
      this.setState ({return: false});
      this.setState ({rideType: 'One Way'});
    } else {
      this.setState ({return: true});
      this.setState ({rideType: 'Return'});
    }
  };

  ridereturnDateCallback = dataFromChild => {
    this.setState ({rideReturnDate: dataFromChild});
  };

  ridereturnTimeCallback = dataFromChild => {
    this.setState ({rideReturnTime: dataFromChild});
  };

  luggageCallback = dataFromChild => {
    this.setState ({luggage: dataFromChild});
  };

  passangerCallback = dataFromChild => {
    this.setState ({passanger: dataFromChild});
  };

  rideDateCallback = dataFromChild => {
    this.setState ({rideDate: dataFromChild});
  };

  rideTimeCallback = dataFromChild => {
    this.setState ({rideTime: dataFromChild});
  };

  viasCallback = dataFromChild => {
    Stops = [];
    Stops = dataFromChild;
  };

  pickupCallback = async dataFromChild => {
    if (dataFromChild === '') {
      this.setState ({pickup: null});
    } else {
      this.setState ({
        pickup: await getLocationObj (dataFromChild),
      });
    }
  };

  dropCallback = async dataFromChild => {
    if (dataFromChild === '') {
      this.setState ({drop: null});
    } else {
      this.setState ({
        drop: await getLocationObj (dataFromChild),
      });
    }
  };

  submitDetails = () => {
    const {
      pickup = {},
      drop = {},
      return: returnAlso,
      rideReturnDate,
      rideReturnTime,
    } = this.state;
    if (!pickup) {
      showMessage ('Please add pickup location.');
    } else if (!drop) {
      showMessage ('Please add drop location.');
    } else if (returnAlso && (!rideReturnDate || !rideReturnTime)) {
      showMessage ('Please select return date and time.');
    } else {
      this.props.navigation.navigate ('QuoteSelection', {
        navObject: {
          ...this.state,
          viaLocations: Stops,
        },
      });
    }
  };

  static propTypes = {
    title: PropTypes.string,
    drawerOpen: PropTypes.func,
    goback: PropTypes.func,
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
  };

  checkForString = () => {
    const {pickup: {description = ''} = {}} = this.state;
    return description && description.toUpperCase ().includes ('AIRPORT');
  };

  onMeetGreetPress = () => {
    const {meetGreet} = this.state;
    this.setState ({meetGreet: !meetGreet});
  };

  render () {
    const {meetGreet, pickup} = this.state;
    return (
      <ImageBackground
        source={require ('../assets/caroverlay.jpg')}
        style={styles.background}
      >
        <CustomHeader
          title="Book a Ride"
          drawerOpen={() => this.props.navigation.openDrawer ()}
          primaryHeader={false}
          transparent
        />
        <View style={{flex: 1}}>
          <Content style={styles.content}>

            <GooglePlacesSearch
              onPress={null}
              placeholder="Enter your pickup location..."
              onChangeText={null}
              iconName="radio-button-off"
              callbackFromParent={this.pickupCallback}
            />
            <GooglePlacesSearch
              onPress={null}
              placeholder="Enter your drop location..."
              onChangeText={null}
              iconName="pin"
              callbackFromParent={this.dropCallback}
            />
            {pickup &&
              this.checkForString () &&
              <CheckBox
                title="Meet & Greet"
                checked={meetGreet}
                textStyle={styles.text}
                checkedColor="#ffffff"
                uncheckedColor="#ffffff"
                onPress={this.onMeetGreetPress}
                containerStyle={styles.checkboxContainer}
              />}
            <Vias
              checked={this.state.via}
              onPress={this.handlePressCheckedBox}
              placeholder="Enter vias address... "
              editable={this.state.via}
              callbackFromParent={this.viasCallback}
            />

            <Radio
              text1="ASAP"
              text2="Later"
              onSelect={(index, value) =>
                this.returnRideOnSelect (index, value)}
            />
            {!this.state.ASAP &&
              <View style={styles.container}>
                <MyDate callbackFromParent={this.rideDateCallback} />
                <Time callbackFromParent={this.rideTimeCallback} />
              </View>}
            {Platform.OS === 'android' &&
              <PassangerLuggage
                luggagecallbackFromParent={this.luggageCallback}
                passangercallbackFromParent={this.passangerCallback}
              />}
            {Platform.OS === 'ios' &&
              <IosPassangerLuggage
                luggagecallbackFromParent={this.luggageCallback}
                passangercallbackFromParent={this.passangerCallback}
              />}

            <Radio
              text1="One Way"
              text2="Return"
              onSelect={(index, value) =>
                this.futureRideOnSelect (index, value)}
            />
            {this.state.return &&
              <View style={styles.container}>
                <MyDate callbackFromParent={this.ridereturnDateCallback} />
                <Time callbackFromParent={this.ridereturnTimeCallback} />
              </View>}
            <Form
              type={contact}
              options={options}
              ref={c => (this._form = c)}
              value={this.state.extraInfo}
              onChange={extraInfo => this.setState ({extraInfo})}
            />
          </Content>
          <SubmitButton title="Submit" onPress={this.submitDetails} />
        </View>
      </ImageBackground>
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
  container: {
    backgroundColor: 'white',
    height: myHeight / 16 + 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    marginVertical: myHeight / 80 + 1,
    justifyContent: 'center',
  },
  text: {
    color: '$white',
    fontSize: 18,
    fontWeight: '500',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
    margin: 0,
    marginTop: 10,
  },
});

export default Home;

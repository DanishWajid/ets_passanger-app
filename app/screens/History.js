import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import * as moment from 'moment';
import {ListItem} from '../components/List';
import {EtsContainer} from '../components/Container';

const rideDetails = [];
const Height = Dimensions.get ('window').height;
class History extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
  };

  constructor (props) {
    super (props);
    this.state = {
      isLoaded: false,
      haveRides: false,
    };
  }

  onSelect = data => {
    this.setState (data);
  };

  componentWillMount () {
    this.getCurrentRides ();
  }

  getCurrentRides () {
    const db = firebase.firestore ();
    db
      .collection ('ride')
      .where (
        'customerId',
        '==',
        db.collection ('users').doc (this.props.currentUser.uid)
      )
      .where ('rideStatus', '==', 5)
      .get ()
      .then (QuerySnapshot => {
        let i = 0;
        QuerySnapshot.forEach (doc => {
          rideDetails[i] = doc.data ();

          i += 1;
        });
      })
      .catch (error => {
        alert (error.message);
      })
      .finally (() => {
        this.setState ({
          isLoaded: true,
        });
        if (rideDetails.length > 0) {
          this.setState ({
            haveRides: true,
          });
        }
      });
  }

  dateConversion (date) {
    const day = date.toString ().slice (5, 7);
    const month = date.toString ().slice (1, 4);
    const year = date.toString ().slice (8, 12);

    return `${`${day.toString ()} `}${`${month.toString ()},`} ${year.toString ()}`;
  }

  handlePress = item => {
    this.props.navigation.navigate ('RideSummary', {
      date: this.dateConversion (item.dateTime.toString ().slice (3, 15)),
      time: moment
        .utc (item.dateTime, 'hmm')
        .utcOffset ('+05:00')
        .format ('hh:mm A')
        .toString (),
      pickup: item.pickup,
      drop: item.dropof,
      luggage: item.luggageItems,
      passengers: item.passengers,
      fare: item.fare,
      via: item.via,
      viaLocations: item.viaLocations,
      return: item.return,
      rideType: item.rideType,
      returnDate: this.dateConversion (
        item.returnDate.toString ().slice (3, 15)
      ),
      returnTime: moment
        .utc (item.returnDate, 'hmm')
        .utcOffset ('+05:00')
        .format ('hh:mm A')
        .toString (),
    });
  };

  render () {
    if (this.state.isLoaded) {
      return (
        <EtsContainer>
          <View style={styles.container}>
            {!this.state.haveRides &&
              <View style={styles.container}>
                <Image
                  style={styles.calender}
                  source={require ('../assets/ets-icon-7.png')}
                />
                <View>
                  <Text style={styles.upperText}>
                    You don't have any rides history.
                  </Text>
                  <Text style={styles.lowerText}>
                    Let's do something about that.
                  </Text>
                  <TouchableHighlight
                    onPress={() => this.props.navigation.navigate ('Home')}
                    underlayColor="rgba(215, 219, 221,1)"
                  >
                    <Text style={styles.buttonText}>
                      BOOK A RIDE
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>}

            {this.state.haveRides &&
              <View style={styles.container}>
                <FlatList
                  data={rideDetails}
                  renderItem={({item}) => (
                    <ListItem
                      date={this.dateConversion (
                        item.dateTime.toString ().slice (3, 15)
                      )}
                      fare={`£ ${item.fare}`}
                      pickup={item.pickup}
                      destination={item.dropof}
                      onPress={() => this.handlePress (item)}
                    />
                  )}
                  keyExtractor={item => item.toString ()}
                />
              </View>}
          </View>
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

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  calender: {
    height: 150,
    width: 150,
    alignSelf: 'center',
    marginVertical: Height * 0.1,
  },
  upperText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: Height * 0.07,
    color: 'black',
  },
  lowerText: {
    alignSelf: 'center',
    marginBottom: Height * 0.01,
    color: 'black',
  },
  buttonText: {
    color: '#EA2141',
    alignSelf: 'center',
    fontWeight: '500',
  },
});

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (History);
